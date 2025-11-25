import { Router } from 'express';
import { z } from 'zod';
import * as stocksController from '../controllers/stocks.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const symbolParamSchema = {
    params: z.object({
        symbol: z.string().min(1, 'Symbol is required'),
    }),
};

// Routes - all require authentication
router.get('/most-bought', authenticate, stocksController.getMostBoughtStocks);
router.get('/', authenticate, stocksController.getAllStocks);
router.get(
    '/:symbol',
    authenticate,
    validate(symbolParamSchema),
    stocksController.getStockBySymbol
);
router.get(
    '/:symbol/history',
    authenticate,
    validate(symbolParamSchema),
    stocksController.getStockHistory
);

export default router;
