import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface AncientAttrs {
    userId: string;
    title: string;
    price: number;
}

export interface AncientDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
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
        type: Number,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    orderId: {
        type: String,
        default: null
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


ancientSchema.set('versionKey', 'version')
ancientSchema.plugin(updateIfCurrentPlugin);

ancientSchema.statics.build = (attrs: AncientAttrs) => {
    return new Ancient(attrs);
};

const Ancient = mongoose.model<AncientDoc, AncientModel>('Ancient', ancientSchema);

export { Ancient }