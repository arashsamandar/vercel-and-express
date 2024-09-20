import mongoose from 'mongoose';

interface UserInterface {
    name: string,
    family: string,
    email: string,
    age: number
}

const UserSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        required: true,
    },
    family: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    }
});

export default mongoose.model<UserInterface>("User", UserSchema, 'users_collection');


