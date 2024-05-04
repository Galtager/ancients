import { currentUser, requireAuth } from "@tagerorg/common";
import express, { Response, Request } from "express";

const router = express.Router();
router.post("/api/ancients", currentUser, requireAuth,
    async (req: Request, res: Response) => {
        res.send({})
    })



export default router;