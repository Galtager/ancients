import request from "supertest";
import app from "../../app";
import { getCookie, createAncient } from "../../test/helper";

it('can fetch a list of ancients', async () => {
    // CREATE ANCIENT
    await createAncient({ title: "title", price: 10 })
    await createAncient({ title: "title2", price: 20 })
    const ancients = await request(app)
        .get('/api/ancients')
        .set('Cookie', getCookie())
        .send().expect(200);
    expect(ancients.body.length).toBe(2)

});
