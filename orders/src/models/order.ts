import mongoose from "mongoose";
import { OrderStatus } from '@tagerorg/common'
interface OrderAttrs {
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
    ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
    ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        require: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };