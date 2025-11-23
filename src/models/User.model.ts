import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 100000,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster email lookups
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
