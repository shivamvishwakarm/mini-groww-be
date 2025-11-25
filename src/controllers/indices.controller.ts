import { Request, Response } from 'express';
import * as indicesService from '../services/indices.service';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Get all indices
 */
export const getAllIndices = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const indices = await indicesService.getAllIndices();
        sendSuccess(res, indices);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};

/**
 * Get index by symbol
 */
export const getIndexBySymbol = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { symbol } = req.params;
        const index = await indicesService.getIndexBySymbol(symbol);

        if (!index) {
            sendError(res, 'Index not found', 404);
            return;
        }

        sendSuccess(res, index);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};
