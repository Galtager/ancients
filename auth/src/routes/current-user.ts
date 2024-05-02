import { currentUser, requireAuth } from '@tagerorg/common'
import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, requireAuth, (req: Request, res: Response) => {
    return res.send({
        currentUser: req.currenUser || null
    })
})

export default router  