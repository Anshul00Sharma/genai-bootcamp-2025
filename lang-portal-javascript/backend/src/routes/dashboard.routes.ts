import { Router } from 'express';
import { getLastStudySession, getStudyProgress, getQuickStats } from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/last_study_session
router.get('/last_study_session', getLastStudySession);

// GET /api/dashboard/study_progress
router.get('/study_progress', getStudyProgress);

// GET /api/dashboard/quick-stats
router.get('/quick-stats', getQuickStats);

export default router;
