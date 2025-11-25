import { Router } from 'express';
import { z } from 'zod';
import * as indicesController from '../controllers/indices.controller';
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
router.get('/', authenticate, indicesController.getAllIndices);
router.get(
    '/:symbol',
    authenticate,
    validate(symbolParamSchema),
    indicesController.getIndexBySymbol
);

export default router;
