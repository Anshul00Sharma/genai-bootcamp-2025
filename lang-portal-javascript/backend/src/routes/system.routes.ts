import { Router } from 'express';
import { resetHistory, fullReset } from '../controllers/system.controller';

const router = Router();

// POST /api/reset_history
router.post('/reset_history', resetHistory);

// POST /api/full_reset
router.post('/full_reset', fullReset);

export default router;
