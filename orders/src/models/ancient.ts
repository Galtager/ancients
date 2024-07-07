import mongoose from "mongoose";
import { OrderStatus } from '@tagerorg/common'
import { Order } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface AncientAttrs {
    id?: string;
    title: string;
    price: number;
}

export interface AncientDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

interface AncientModel extends mongoose.Model<AncientDoc> {
    build(attrs: AncientAttrs): AncientDoc;
    findByEvent(event: { id: string, version: number }): Promise<AncientDoc | null>;

}
const ancientSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
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
ancientSchema.set("versionKey", "version");
ancientSchema.plugin(updateIfCurrentPlugin);

ancientSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ancient.findOne({ _id: event.id, version: event.version - 1 });
};

ancientSchema.statics.build = (attrs: AncientAttrs) => {
    return new Ancient({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    })
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