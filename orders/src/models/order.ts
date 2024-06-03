import mongoose from "mongoose";
import { OrderStatus } from '@tagerorg/common'
import { AncientDoc } from "./ancient";
interface OrderAttrs {
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
    ancient: AncientDoc
}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
    ancient: AncientDoc
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
        require: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        require: true
    },
    ancient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ancient'
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