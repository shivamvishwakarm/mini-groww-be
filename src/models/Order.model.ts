import mongoose, { Document, Schema } from 'mongoose';

export type OrderSide = 'BUY' | 'SELL';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    symbol: string;
    side: OrderSide;
    quantity: number;
    price: number;
    createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
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
        side: {
            type: String,
            required: true,
            enum: ['BUY', 'SELL'],
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster user order lookups
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ symbol: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
