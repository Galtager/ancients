import { OrderStatus } from "@tagerorg/common";
import app from "../../app";
import { Order } from "../../models/order";
import { getCookie, getMongoGuid } from "../../test/helper";
import request from 'supertest'

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', getCookie())
        .send({
            token: 'asdas',
            orderId: getMongoGuid()
        }).expect(404)
})
it('returns a 401 when purchasing an order that does not belod to the user', async () => {
    const order = Order.build({ id: getMongoGuid(), status: OrderStatus.Created, userId: getMongoGuid(), price: 20, version: 0 })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', getCookie())
        .send({
            token: 'asdas',
            orderId: order.id
        }).expect(401)
})
it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = getMongoGuid();
    const order = Order.build({ id: getMongoGuid(), status: OrderStatus.Cacncelled, userId, price: 20, version: 0 })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', getCookie(userId))
        .send({
            token: 'asdas',
            orderId: order.id
        }).expect(400)
})