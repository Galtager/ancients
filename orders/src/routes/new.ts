import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { Ancient } from "../models/ancient";

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
    // await new OrderCreatePublisher(natsWrapper.client).publish({
    //     id: ancient.id,
    //     title: ancient.title!,
    //     price: ancient.price!,
    //     userId: ancient.userId!
    // })

    res.status(201).send(order);
})

export default router;