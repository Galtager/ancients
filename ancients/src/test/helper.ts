
import request from "supertest";
import JWT from "jsonwebtoken";
import mongoose from 'mongoose';
import app from "../app";
import { AncientDto } from "../../interfaces/ancients.interface";

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
const createAncient = ({ title, price }: AncientDto) => {
    return request(app)
        .post('/api/ancients')
        .set('Cookie', getCookie())
        .send({ title, price });
}
export { getCookie, getMongoGuid, createAncient }