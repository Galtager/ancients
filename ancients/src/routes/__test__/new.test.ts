import request from "supertest";
import app from "../../app";
import { getCookie } from "../../test/setup";

it('has route handler listening to /api/tickets for post request', async () => {
    const res = await request(app)
        .post('/api/ancients')
        .send({})
    expect(res.status).not.toEqual(404)
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
})
it('returns error if an invalid price is provided', async () => {
})
it('returns new ancient created', async () => {
})