import { currentUser, requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";

const router = express.Router();


router.get("/api/orders", currentUser, requireAuth, async (req: Request, res: Response) => {

    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate("ancient");
    res.send(orders);

})

export default router;