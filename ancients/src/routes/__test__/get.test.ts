import request from "supertest";
import app from "../../app";
import { getCookie } from "../../test/setup";

it('returns a 404 if ancient is not found', async () => {
    const res = await request(app)
        .get('/api/ancients/testId')
        .set('Cookie', getCookie())
        .send()
    expect(res.status).toBe(404);
})
it('return the ancient if found', async () => {
    const { title, price } = { title: 'good title', price: 10 }
    // CREATE ANCIENT
    const response = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title,
            price
        })
    expect(response.status).toBe(201);
    // GET ANCIENT
    const ancientResponse = await request(app)
        .get(`/api/ancients/${response.body.id}`)
        .set('Cookie', getCookie())
        .send()

    expect(ancientResponse.status).toBe(200);
    expect(ancientResponse.body.title).toBe(title)
    expect(ancientResponse.body.price).toBe(price)
    expect(ancientResponse.body.id).toBe(response.body.id)

})
