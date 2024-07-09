import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Ancient } from "../models/ancient";
import mongoose from "mongoose";
import { body } from "express-validator";
import { AncientUpdatePublisher } from "../events/publishers/ancients-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const validators = [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
]

router.put("/api/ancients/:id", requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
        throw new NotFoundError()
    }
    const ancient = await Ancient.findById(req.params.id);
    if (!ancient) {
        throw new NotFoundError()
    }
    if (ancient.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }
    ancient.set({
        title: req.body.title,
        price: req.body.price

    })
    await ancient.save();

    await new AncientUpdatePublisher(natsWrapper.client).publish({
        id: ancient.id,
        title: ancient.title!,
        price: ancient.price!,
        userId: ancient.userId!,
        version: ancient.version,
        orderId: ancient.orderId
    })

    res.send(ancient);


})

export default router;