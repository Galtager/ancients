
import JWT from "jsonwebtoken";
import mongoose from 'mongoose';

const getCookie = (id?: string) => {
    const payload = {
        id: id || getMongoGuid(),
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
export { getCookie, getMongoGuid }