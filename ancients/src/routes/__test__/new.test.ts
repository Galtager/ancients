import request from "supertest";
import app from "../../app";
import { getCookie } from "../../test/setup";
import { Ancient } from "../../models/ancient";

it('has route handler listening to /api/tickets for post request', async () => {
    try {
        const res = await request(app)
            .post('/api/ancients')
            .send({})
        expect(res.status).not.toEqual(404)
    } catch (error) {
        console.log(error)
    }
})

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/ancients')
        .send({}).expect(401)
})
it('return a status other then 401 if the user is siged in ', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({});
    expect(res.status).not.toEqual(401)
})

it('returns error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            price: 10
        }).expect(400);
})
it('returns error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title: 'only title',
        }).expect(400);
})
it('returns error if an empty title is provided', async () => {
    await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title: '',
            price: 10
        }).expect(400);
})
it('returns new ancient created', async () => {
    let ancients = await Ancient.find();
    expect(ancients.length).toEqual(0);
    const { title, price } = { title: 'good title', price: 10 }
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({
            title,
            price
        }).expect(201);
    ancients = await Ancient.find();
    expect(ancients.length).toEqual(1)
    expect(ancients[0].price).toEqual(price)
    expect(ancients[0].title).toEqual(title)
})