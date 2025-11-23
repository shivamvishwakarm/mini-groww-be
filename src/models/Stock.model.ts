import mongoose, { Document, Schema } from 'mongoose';

export interface IStock extends Document {
    symbol: string;
    name: string;
    sector: string;
    currentPrice: number;
    previousClose: number;
    marketCap: number;
}

const stockSchema = new Schema<IStock>(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sector: {
            type: String,
            required: true,
            trim: true,
        },
        currentPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        previousClose: {
            type: Number,
            required: true,
            min: 0,
        },
        marketCap: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster symbol lookups
stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });

export const Stock = mongoose.model<IStock>('Stock', stockSchema);
