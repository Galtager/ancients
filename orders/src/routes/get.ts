import { NotAuthorizedError, NotFoundError, currentUser, requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();


router.get("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
        throw new NotFoundError()
    }
    const order = await Order.findById(req.params.id).populate("ancient");
    if (!order) {
        throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }
    res.send(order);
})

export default router;