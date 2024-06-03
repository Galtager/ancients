import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { Ancient } from "../models/ancient";

const router = express.Router();

const validators = [
    body('ancientId')
        .isString()
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ancientId is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
]

router.post("/api/orders", requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    const { ancientId, price } = req.body;

    const ancient = await Ancient.findById(ancientId);
    if (!ancient) {
        throw new NotFoundError()
    }
    const isReserved = await ancient.isReserved()

    if (isReserved) {
        throw new BadRequestError("Ancient is already reserved")
    }

    // await new AncientCreatePublisher(natsWrapper.client).publish({
    //     id: ancient.id,
    //     title: ancient.title!,
    //     price: ancient.price!,
    //     userId: ancient.userId!
    // })

    // res.status(201).send(order);
})

export default router;