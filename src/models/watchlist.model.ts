import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface IWatchlist extends Document {
    userId: Types.ObjectId;
    symbols: string[]; // array of stock symbols
}

const WatchlistSchema = new Schema<IWatchlist>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    symbols: { type: [String], default: [] },
});

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
