import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { config } from '../config/env';

/**
 * Register a new user
 */
export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await authService.register(req.body);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
        sendError(res, (error as Error).message, 400);
    }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.login(req.body);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        sendSuccess(res, result, 'Login successful');
    } catch (error) {
        sendError(res, (error as Error).message, 401);
    }
};

/**
 * Get current user
 */
export const getCurrentUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        const user = await authService.getUserById(req.user.userId);
        if (!user) {
            sendError(res, 'User not found', 404);
            return;
        }

        sendSuccess(res, {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            balance: user.balance,
            createdAt: user.createdAt,
        });
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};
