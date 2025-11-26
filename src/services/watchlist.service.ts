import { Watchlist, IWatchlist } from '../models/watchlist.model';
import { Types } from 'mongoose';

export const getWatchlist = async (userId: string): Promise<IWatchlist | null> => {
    return Watchlist.findOne({ userId: new Types.ObjectId(userId) });
};

export const addToWatchlist = async (userId: string, symbol: string) => {
    const wl = await Watchlist.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $addToSet: { symbols: symbol.toUpperCase() } },
        { upsert: true, new: true }
    );
    return wl;
};

export const removeFromWatchlist = async (userId: string, symbol: string) => {
    const wl = await Watchlist.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $pull: { symbols: symbol.toUpperCase() } },
        { new: true }
    );
    return wl;
};
