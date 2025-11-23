import { Router } from 'express';
import { z } from 'zod';
import * as ordersController from '../controllers/orders.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const createOrderSchema = {
    body: z.object({
        symbol: z.string().min(1, 'Symbol is required'),
        side: z.enum(['BUY', 'SELL'], {
            errorMap: () => ({ message: 'Side must be BUY or SELL' }),
        }),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
    }),
};

// Routes - all require authentication
router.post('/', authenticate, validate(createOrderSchema), ordersController.createOrder);
router.get('/', authenticate, ordersController.getUserOrders);

export default router;
