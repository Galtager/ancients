import { requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { AncientCreatePublisher } from "../events/publishers/ancients-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

const router = express.Router();

const validators = [
    body('ticketId')
        .isString()
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
]

router.post("/api/orders", requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const order = await Order.create({
        title,
        price,
        userId: req.currentUser?.id
    });
    await order.save();

    // await new AncientCreatePublisher(natsWrapper.client).publish({
    //     id: ancient.id,
    //     title: ancient.title!,
    //     price: ancient.price!,
    //     userId: ancient.userId!
    // })

    res.status(201).send(order);
})

export default router;