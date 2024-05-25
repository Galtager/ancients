import { requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Order } from "../models/order";

const router = express.Router();


router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {

    const ancients = await Order.find({});
    res.send(ancients);

})

export default router;