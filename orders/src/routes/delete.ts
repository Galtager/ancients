import { NotAuthorizedError, NotFoundError, OrderStatus, currentUser, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { OrderCancelledPublisher } from "../events/publishers/ancients-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ancient: {
            id: order.ancient.id,
            price: order.ancient.price
        }
    })
    res.status(204).send(order);
})

export default router;