import { requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Ancient } from "../models/ancient";

const router = express.Router();


router.get("/api/ancients", requireAuth, async (req: Request, res: Response) => {

    const ancients = await Ancient.find({
        orderId: undefined
    });
    res.send(ancients);

})

export default router;