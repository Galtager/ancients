import request from "supertest";
import app from "../../app";
import { createAncient, getCookie, getMongoGuid } from "../../test/helper";
import { Ancient } from "../../models/ancient";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if ancient is not exist', async () => {
    const guid = getMongoGuid()
    const res = await request(app)
        .put(`/api/ancients/${guid}`)
        .set('Cookie', getCookie())
        .send({ title: 'update title', price: 20 })
    expect(res.status).toBe(404);
});
it('returns a 401 if a user is not authenticated', async () => {
    const guid = getMongoGuid()
    const res = await request(app)
        .put(`/api/ancients/${guid}`)
        .send()
    expect(res.status).toBe(401);
});
it('returns a 401 if a user does not own the ticket', async () => {
    const ancient = await createAncient({ title: 'ssda', price: 10 })
    const res = await request(app)
        .put(`/api/ancients/${ancient.body.id}`)
        .set('Cookie', getCookie())
        .send({ title: "adas", price: 30 })
    expect(res.status).toBe(401);
});
it('returns a 400 if a user provides an invalid title ot price', async () => {
    const guid = getMongoGuid()
    await request(app)
        .put(`/api/ancients/${guid}`)
        .set('Cookie', getCookie())
        .send({ title: '20', price: "string" }).expect(400)
    await request(app)
        .put(`/api/ancients/${guid}`)
        .set('Cookie', getCookie())
        .send({ title: 20, price: 20 }).expect(400)
    await request(app)
        .put(`/api/ancients/${guid}`)
        .set('Cookie', getCookie())
        .send({ price: 20 }).expect(400)
    await request(app)
        .put(`/api/ancients/${guid}`)
        .set('Cookie', getCookie())
        .send({ title: "asdasd" }).expect(400)

});
it('updates the ancients provided a valid inputs', async () => {
    const cookie = getCookie()
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', cookie)
        .send({
            title: "232",
            price: 20
        })
    await request(app)
        .put(`/api/ancients/${res.body.id}`)
        .set('Cookie', cookie)
        .send({ title: "new title", price: 10 }).expect(200);

    const ancientRes = await request(app)
        .get(`/api/ancients/${res.body.id}`)
        .set('Cookie', cookie)
        .send()
    expect(ancientRes.body.title).toBe('new title')
    expect(ancientRes.body.price).toBe(10)
});

it('publishes an event', async () => {
    const cookie = getCookie()
    const res = await request(app)
        .post('/api/ancients')
        .set('Cookie', cookie)
        .send({
            title: "232",
            price: 20
        })
    await request(app)
        .put(`/api/ancients/${res.body.id}`)
        .set('Cookie', cookie)
        .send({ title: "new title", price: 10 }).expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})