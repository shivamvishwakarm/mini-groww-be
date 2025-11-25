import { Schema, model, Document } from 'mongoose';

export interface IIndex extends Document {
    symbol: string;
    name: string;
    currentValue: number;
    previousClose: number;
}

const indexSchema = new Schema<IIndex>(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        currentValue: {
            type: Number,
            required: true,
            min: 0,
        },
        previousClose: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Index = model<IIndex>('Index', indexSchema);
