import { Request, Response } from 'express';
import * as portfolioService from '../services/portfolio.service';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Get user's portfolio
 */
export const getUserPortfolio = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        const portfolio = await portfolioService.getUserPortfolio(req.user.userId);
        sendSuccess(res, portfolio);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};
