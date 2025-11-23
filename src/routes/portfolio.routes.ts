import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Routes - all require authentication
router.get('/', authenticate, portfolioController.getUserPortfolio);

export default router;
