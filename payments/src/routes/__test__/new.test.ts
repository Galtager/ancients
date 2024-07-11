import { OrderStatus } from "@tagerorg/common";
import app from "../../app";
import { Order } from "../../models/order";
import { getCookie, getMongoGuid } from "../../test/helper";
import request from 'supertest'
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

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
it('returns a 204 with valid inputs', async () => {
    const userId = getMongoGuid();
    const order = Order.build({ id: getMongoGuid(), status: OrderStatus.Created, userId, price: 20, version: 0 })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', getCookie(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        }).expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(order.price * 100)
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({ orderId: order.id });
    expect(payment).not.toBeNull();

})
