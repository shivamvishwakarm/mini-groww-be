import { Request, Response } from 'express';
import * as ordersService from '../services/orders.service';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Create a new order
 */
export const createOrder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        const order = await ordersService.createOrder({
            userId: req.user.userId,
            ...req.body,
        });

        sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
        sendError(res, (error as Error).message, 400);
    }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            sendError(res, 'User not authenticated', 401);
            return;
        }

        const orders = await ordersService.getUserOrders(req.user.userId);
        sendSuccess(res, orders);
    } catch (error) {
        sendError(res, (error as Error).message, 500);
    }
};
