import request from "supertest";
import app from "../../app";
import { getCookie } from "../../test/setup";
import { Ancient } from "../../models/ancient";

it('has route handler listening to /api/ancients for post request', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .send({})
    expect(res.status).not.toBe(404);
})
it('can only be accessed if the user is signed in', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .send({})
    expect(res.status).toBe(401);
})
it('return a status other then 401 if the user is siged in ', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({});
    expect(res.status).not.toBe(401)
})
it('returns error if an invalid title is provided', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            price: 10
        })
    expect(res.status).toBe(400)
})
it('returns error if an invalid price is provided', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title: 'only title',
        })
    expect(res.status).toBe(400)
})
it('returns error if an empty title is provided', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title: '',
            price: 10
        })
    expect(res.status).toBe(400)

})
it('returns new ancient created', async () => {
    let ancients = await Ancient.find();
    expect(ancients.length).toBe(0);
    const { title, price } = { title: 'good title', price: 10 }
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title,
            price
        })

    ancients = await Ancient.find();

    expect(res.status).toBe(201)
    expect(ancients.length).toBe(1)
    expect(ancients[0].price).toBe(price)
    expect(ancients[0].title).toBe(title)
});
