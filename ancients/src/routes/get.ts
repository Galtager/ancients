import { NotFoundError, requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Ancient } from "../models/ancient";

const router = express.Router();


router.get("/api/ancients/:id", requireAuth, async (req: Request, res: Response) => {
    const ancient = await Ancient.findById(req.params.id);
    if (!ancient) {
        throw new NotFoundError()
    }
    res.send(ancient);
})

export default router;