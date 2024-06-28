import { NotAuthorizedError, NotFoundError, OrderStatus, currentUser, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();


router.delete("/api/orders/:orderId", currentUser, requireAuth, async (req: Request, res: Response) => {
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
    order.status = OrderStatus.Cacncelled
    await order.save();

    // await new AncientUpdatePublisher(natsWrapper.client).publish({
    //     id: ancient.id,
    //     title: ancient.title!,
    //     price: ancient.price!,
    //     userId: ancient.userId!
    // })
    res.status(204).send(order);
})

export default router;