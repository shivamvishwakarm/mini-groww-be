import { Request, Response } from 'express';
import * as stocksService from '../services/stocks.service';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Get all stocks
 */
export const getAllStocks = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const stocks = await stocksService.getAllStocks();
        sendSuccess(res, stocks);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};

/**
 * Get stock by symbol
 */
export const getStockBySymbol = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { symbol } = req.params;
        const stock = await stocksService.getStockBySymbol(symbol);

        if (!stock) {
            sendError(res, 'Stock not found', 404);
            return;
        }

        sendSuccess(res, stock);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};

/**
 * Get stock price history
 */
export const getStockHistory = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { symbol } = req.params;
        const history = await stocksService.getStockHistory(symbol);
        sendSuccess(res, history);
    } catch (error) {
        sendError(res, (error as Error).message, 404);
    }
};

/**
 * Get most bought stocks
 */
export const getMostBoughtStocks = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const mostBought = await stocksService.getMostBoughtStocks(10);
        sendSuccess(res, mostBought);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};
