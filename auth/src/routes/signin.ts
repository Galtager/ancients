import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-rquest-error';
import { User } from '../models/user';
import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';
import jwt from 'jsonwebtoken';

const router = express.Router()

const validators = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
]

router.post('/api/users/signin', validators, validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const exsistingUser = await User.findOne({ email })
    if (!exsistingUser) {
        throw new BadRequestError('Invalid credentials');
    }
    const passwordsMatch = await Password.compare(exsistingUser.password!, password)
    if (!passwordsMatch) {
        throw new BadRequestError('Invalid credentials');
    }
    // Generate JWT
    const userJwt = jwt.sign({
        id: exsistingUser.id,
        email: exsistingUser.email
    }, process.env.JWT_KEY!)

    // Store it on session object
    req.session = { jwt: userJwt }

    res.status(201).send(exsistingUser);
})

export default router  