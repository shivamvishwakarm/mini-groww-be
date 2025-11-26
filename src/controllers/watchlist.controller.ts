import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as watchlistService from '../services/watchlist.service';

export const getWatchlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const wl = await watchlistService.getWatchlist(userId);
        return sendSuccess(res, wl ?? { symbols: [] });
    } catch (e) {
        return sendError(res, (e as Error).message, 500);
    }
};

export const addSymbol = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { symbol } = req.body;
        if (!symbol) return sendError(res, 'symbol required', 400);
        const wl = await watchlistService.addToWatchlist(userId, symbol);
        return sendSuccess(res, wl);
    } catch (e) {
        return sendError(res, (e as Error).message, 500);
    }
};

export const removeSymbol = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { symbol } = req.body;
        if (!symbol) return sendError(res, 'symbol required', 400);
        const wl = await watchlistService.removeFromWatchlist(userId, symbol);
        return sendSuccess(res, wl);
    } catch (e) {
        return sendError(res, (e as Error).message, 500);
    }
};
