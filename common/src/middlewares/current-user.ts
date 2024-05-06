import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const noJwt = !req.session?.jwt || Object.keys({}).length === 0;
        if (noJwt) {
            return next();
        }
        const payload = jwt.verify(req.session!.jwt, process.env.JWT_KEY!) as UserPayload
        req.currentUser = payload
    } catch (error) {
    } finally {
        next();
    }
};