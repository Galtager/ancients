import request from "supertest";
import app from "../../app";


it('fails when a email that does not exist ', async () => {
    return request(app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(400)
})
it('fails when an incorrect credentials is supplied', async () => {

    await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
    await request(app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: 'test1232'
    }).expect(400)
    return await request(app).post('/api/users/signin').send({
        email: 'test2@test.com',
        password: 'test123'
    }).expect(400)
});
it('return 201 when correct credentials is  supplied', async () => {
    await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
    return await request(app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
});
it('responds with a a coockie after successfull signin', async () => {
    await request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
    const response = await request(app).post('/api/users/signin').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
    expect(response.get('Set-Cookie')).toBeDefined();
})