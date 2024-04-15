import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
    email: string;
    password: string;
}
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const password = this.get('password')
        if (password) {
            const hashed = await Password.toHash(password)
            this.set('password', hashed)
        }
    }
    done();
})

const User = mongoose.model('User', userSchema);

export { User }