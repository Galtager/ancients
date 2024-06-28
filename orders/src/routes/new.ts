import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { Ancient } from "../models/ancient";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatePublisher } from "../events/publishers/ancients-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60

const validators = [
    body('ancientId')
        .isString()
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ancientId is required')]

router.post("/api/orders", requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    const { ancientId } = req.body;

    const ancient = await Ancient.findById(ancientId);
    if (!ancient) {
        throw new NotFoundError()
    }

    const isReserved = await ancient.isReserved()
    if (isReserved) {
        throw new BadRequestError("Ancient is already reserved")
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
        userId: req.currentUser!.id!,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ancient
    })
    await order.save();

    // publish an event 
    new OrderCreatePublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        userId: order.userId,
        ancient: {
            id: order.ancient.id,
            price: order.ancient.price
        }
    })

    res.status(201).send(order);
})

export default router;