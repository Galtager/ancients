import { NotFoundError, requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();


router.get("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
        throw new NotFoundError()
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new NotFoundError()
    }
    res.send(order);

})

export default router;