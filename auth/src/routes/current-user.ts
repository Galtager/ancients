import express, { Request, Response } from 'express'
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router()

router.get('/api/users/currentuser', currentUser, requireAuth, (req: Request, res: Response) => {
    return res.send({
        currentUser: req.currenUser || null
    })
})

export default router  