import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@tagerorg/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import mongoose from "mongoose";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";

const router = express.Router();

const validators = [
    body('orderId')
        .isString()
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('valid orderId is required'),
    body('token')
        .not()
        .isEmpty()
]

router.post("/api/payments", requireAuth, validators, validateRequest, async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError()
    }
    if (req.currentUser?.id !== order.userId) {
        throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cacncelled) {
        throw new BadRequestError("Cannot pay for cancelled order")
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: 'tok_visa' // replace with real token for charge
    })
    const payment = Payment.build({ orderId: order.id, stripeId: charge.id })
    await payment.save();

    res.status(201).send(order);
})

export default router;