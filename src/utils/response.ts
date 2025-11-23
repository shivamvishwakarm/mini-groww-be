import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    details?: any;
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        ...(message && { message }),
        data,
    };
    return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
    res: Response,
    message: string,
    statusCode = 400,
    details?: any
): Response => {
    const response: ApiResponse = {
        success: false,
        message,
        ...(details && { details }),
    };
    return res.status(statusCode).json(response);
};
