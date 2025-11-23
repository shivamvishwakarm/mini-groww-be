import mongoose, { Document, Schema } from 'mongoose';

export interface IHolding extends Document {
    userId: mongoose.Types.ObjectId;
    symbol: string;
    quantity: number;
    avgBuyPrice: number;
}

const holdingSchema = new Schema<IHolding>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        avgBuyPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index - one holding per user per symbol
holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Holding = mongoose.model<IHolding>('Holding', holdingSchema);
