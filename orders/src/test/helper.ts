
import request from "supertest";
import JWT from "jsonwebtoken";
import mongoose from 'mongoose';
import app from "../app";
import { OrderDto } from "../../interfaces/order.interface";
import { Ancient } from "../models/ancient";

const getCookie = () => {
    const payload = {
        id: getMongoGuid(),
        email: 'test@test.com'
    }
    const token = JWT.sign(payload, process.env.JWT_KEY!)
    const sess = { jwt: token }
    const sessionJSON = JSON.stringify(sess);
    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`session=${base64}`];
}

const getMongoGuid = () => {
    return new mongoose.Types.ObjectId().toHexString()
}
const createAncient = async ({ title, price }: OrderDto) => {
    const ancient = Ancient.build({ title, price })
    await ancient.save();
    return ancient;
}
const createOrder = (ancientId: string, coockie?: string[]) => {
    return request(app)
        .post('/api/orders')
        .set('Cookie', coockie ?? getCookie())
        .send({ ancientId });
}

export { getCookie, getMongoGuid, createAncient, createOrder }