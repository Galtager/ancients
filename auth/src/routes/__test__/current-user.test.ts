import request from "supertest";
import app from "../../app";
import { getCookie } from "../../test/auth-helper";



it('get current user', async () => {
    const signup = await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201);
    const coockie = await getCookie(signup)
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', coockie)
        .send()
        .expect(200);
    expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
    await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(401);
})