import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import JWT from "jsonwebtoken";

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasf'
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
})
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany();
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close();
});


const getCookie = () => {
    const payload = {
        id: 'lad123dasd',
        email: 'test@test.com'
    }
    const token = JWT.sign(payload, process.env.JWT_KEY!)
    const sess = { jwt: token }
    const sessionJSON = JSON.stringify(sess);
    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`session=${base64}`];
}
export { getCookie }