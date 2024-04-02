import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';

const router = express.Router()

const validators = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
]

router.post('/api/users/signup', validators, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const exsistingUser = await User.findOne({ email })
    if (exsistingUser) {
        console.log('Email in user');
        return res.send({})
    }
})

export default router  