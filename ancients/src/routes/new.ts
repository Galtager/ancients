import { requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Ancient } from "../models/ancient";
import { AncientCreatePublisher } from "../events/publishers/ancients-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const validators = [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
]

router.post("/api/ancients", requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ancient = Ancient.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ancient.save();

    await new AncientCreatePublisher(natsWrapper.client).publish({
        id: ancient.id,
        title: ancient.title!,
        price: ancient.price!,
        userId: ancient.userId!,
        version: ancient.version
    })
    res.status(201).send(ancient);
})

export default router;