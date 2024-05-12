import { NotFoundError, requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { Ancient } from "../models/ancient";
import mongoose from "mongoose";

const router = express.Router();


router.get("/api/ancients/:id", requireAuth, async (req: Request, res: Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
        throw new NotFoundError()
    }
    const ancient = await Ancient.findById(req.params.id);
    if (!ancient) {
        throw new NotFoundError()
    }
    res.send(ancient);

})

export default router;