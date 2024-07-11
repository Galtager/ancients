import app from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { AncientCreatedListener } from './events/listeners/ancient-created-listener';
import { AncientUpdatedListener } from './events/listeners/ancient-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }
    if (!process.env.DB_URI) {
        throw new Error("DB_URI must be defined")
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined")
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined")
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined")
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

        natsWrapper.client.on('close', () => {
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        // listen to events
        new AncientCreatedListener(natsWrapper.client).listen()
        new AncientUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        new PaymentCreatedListener(natsWrapper.client).listen()

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
