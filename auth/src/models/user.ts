import mongoose from "mongoose";

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
})

const User = mongoose.model('User', userSchema);

export { User }