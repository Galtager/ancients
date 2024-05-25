import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { AncientUpdatePublisher } from "../events/publishers/ancients-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();


router.put("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.orderId);
    if (!isValidId) {
        throw new NotFoundError()
    }
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        throw new NotFoundError()
    }
    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }
    order.deleteOne()
    await order.save();

    // await new AncientUpdatePublisher(natsWrapper.client).publish({
    //     id: ancient.id,
    //     title: ancient.title!,
    //     price: ancient.price!,
    //     userId: ancient.userId!
    // })

    res.send();


})

export default router;