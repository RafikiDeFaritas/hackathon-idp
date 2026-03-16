import mongoose, { Document, Schema } from 'mongoose';

export type Role = 'USER' | 'ADMIN';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    role: Role;
    name: string;
    email: string;
    mdpHash: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true
    },
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mdpHash: { type: String, required: true },
}, {
    timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);