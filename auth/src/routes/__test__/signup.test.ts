import request from "supertest";
import app from "../../app";


it('return 201 on successfull signup', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
})
it('return 201 on successfull signup', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: 'test123'
    }).expect(201)
})

it('return 400 on invalid email', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'test',
        password: 'test123'
    }).expect(400)
})
it('return 400 on invalid password', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'test@test.com',
        password: '1'
    }).expect(400)
})
it('return 400 on missing email and password', async () => {
    await request(app).post('/api/users/signup').send({ email: 'test@test.com' }).expect(400)
    await request(app).post('/api/users/signup').send({ password: 'asdas1' }).expect(400)
})
it('disallowes duplicate emails', async () => {
    await request(app).post('/api/users/signup').send({ email: 'test@test.com', password: 'test123' }).expect(201);
    await request(app).post('/api/users/signup').send({ email: 'test@test.com', password: 'test123' }).expect(400);
})
it('sets a coockie after successfull signup', async () => {
    const response = await request(app).post('/api/users/signup').send({ email: 'test@test.com', password: 'test123' }).expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
})