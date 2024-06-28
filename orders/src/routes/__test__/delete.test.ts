import { OrderStatus } from "@tagerorg/common";
import app from "../../app";
import { createAncient, createOrder, getCookie, getMongoGuid } from "../../test/helper";
import request from 'supertest'
import { natsWrapper } from "../../nats-wrapper";

it('check for not valid id', async () => {
    await request(app)
        .delete(`/api/orders/123r5124es`)
        .set('Cookie', getCookie())
        .send().expect(404)
})
it('check for not order found', async () => {
    await request(app)
        .delete(`/api/orders/${getMongoGuid()}`)
        .set('Cookie', getCookie())
        .send().expect(404)
})
it('check user canot update another user order', async () => {
    const ancientOne = await createAncient({ price: 13, title: "test" });
    const order = await createOrder(ancientOne.id).expect(201);
    await request(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie', getCookie())
        .send().expect(401)
})
it('delete an order', async () => {
    const ancientOne = await createAncient({ price: 13, title: "test" });
    const newUserCoockie = getCookie()

    const order = await createOrder(ancientOne.id, newUserCoockie).expect(201);

    await request(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie', newUserCoockie)
        .send().expect(204)
    const res = await request(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', newUserCoockie)
        .send();
    expect(res.body.status).toBe(OrderStatus.Cacncelled);
})
it("emits an order created event", async () => {
    const ancientOne = await createAncient({ price: 13, title: "test" });
    const newUserCoockie = getCookie()

    const order = await createOrder(ancientOne.id, newUserCoockie).expect(201);

    await request(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie', newUserCoockie)
        .send().expect(204)


    expect(natsWrapper.client.publish).toHaveBeenCalled()
})