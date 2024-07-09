import app from "../../app";
import { createAncient, createOrder, getCookie } from "../../test/helper";
import request from 'supertest'

it('fetches orders for an particular user', async () => {
    // Create 3 ancients
    const ancientOne = await createAncient({ price: 13, title: "test" });
    const ancientTwo = await createAncient({ price: 14, title: "test2" });
    const ancientThree = await createAncient({ price: 15, title: "test3" });

    const newUserCoockie = getCookie()
    await createOrder(ancientOne.id).expect(201);
    await createOrder(ancientTwo.id, newUserCoockie).expect(201);
    await createOrder(ancientThree.id, newUserCoockie).expect(201);

    const res = await request(app)
        .get(`/api/orders`)
        .set('Cookie', newUserCoockie)
        .send()
    expect(res.body.length).toBe(2);
})
it('populate the ancient for the order', async () => {
    const ancient = await createAncient({ price: 13, title: "test" });
    const newUserCoockie = getCookie()
    await createOrder(ancient.id, newUserCoockie).expect(201);
    const res = await request(app)
        .get(`/api/orders`)
        .set('Cookie', newUserCoockie)
        .send()
    expect(res.body[0].ancient.id).toEqual(ancient.id);

})