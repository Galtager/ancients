import request from "supertest";
import app from "../../app";



it('clears the cookie after singing out', async () => {
    await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)

    const signoutRespons = await request(app).post('/api/users/signout').send({}).expect(200);
    expect(signoutRespons.get('Set-Cookie')).toBeDefined();
    expect(signoutRespons.get('Set-Cookie')![0]).toEqual(
        "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
})