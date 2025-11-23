import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
): void => {
    // Log error
    logger.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
    });

    // Send error response
    sendError(
        res,
        error.message || 'Internal server error',
        500
    );
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response
): void => {
    sendError(res, `Route ${req.url} not found`, 404);
};
