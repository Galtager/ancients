import app from "../../app";
import { createAncient, createOrder, getCookie } from "../../test/helper";
import request from 'supertest'

it('fetches the order', async () => {
    const ancientOne = await createAncient({ price: 13, title: "test" });

    const newUserCoockie = getCookie()
    const order = await createOrder(ancientOne.id, newUserCoockie).expect(201);
    const res = await request(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', newUserCoockie)
        .send();
    expect(res.body.id).toBe(order.body.id);
})
it('returns error if one user trie to fetch another users order', async () => {
    const ancientOne = await createAncient({ price: 13, title: "test" });

    const newUserCoockie = getCookie()
    const order = await createOrder(ancientOne.id).expect(201);
    await request(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', newUserCoockie)
        .send().expect(401);
})