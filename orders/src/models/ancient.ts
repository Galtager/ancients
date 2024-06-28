import mongoose from "mongoose";
import { OrderStatus } from '@tagerorg/common'
import { Order } from "./order";
interface AncientAttrs {
    title: string;
    price: number;
    version?: string
}

export interface AncientDoc extends mongoose.Document {
    title: string;
    price: number;
    version: string;
    isReserved(): Promise<boolean>
}

interface AncientModel extends mongoose.Model<AncientDoc> {
    build(attrs: AncientAttrs): AncientDoc
}
const ancientSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    version: {
        type: String,
        default: "0",
        require: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ancientSchema.statics.build = (attrs: AncientAttrs) => {
    return new Ancient(attrs)
};
ancientSchema.methods.isReserved = async function (attrs: AncientAttrs) {
    const existingOrder = await Order.find({
        ancient: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return existingOrder.length > 0
};

const Ancient = mongoose.model<AncientDoc, AncientModel>('Ancient', ancientSchema);

export { Ancient };