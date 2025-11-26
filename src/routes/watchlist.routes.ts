import { Router } from 'express';
import * as controller from '../controllers/watchlist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.get('/', authenticate, controller.getWatchlist);
router.post('/add', authenticate, validate({ body: z.object({ symbol: z.string() }) }), controller.addSymbol);
router.post('/remove', authenticate, validate({ body: z.object({ symbol: z.string() }) }), controller.removeSymbol);

export default router;
