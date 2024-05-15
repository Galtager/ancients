import app from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }
    if (!process.env.DB_URI) {
        throw new Error("DB_URI must be defined")
    }
    try {
        await natsWrapper.connect("ancients", "asdas", "http://nats-srv:4222")
        await mongoose.connect(process.env.DB_URI!)
        console.log("Connected to Mongodb")

    } catch (error) {
        console.error(error)
    }
    app.listen(3000, () => {
        console.log("Listening on port 3000!!!")
    })
}

start();
