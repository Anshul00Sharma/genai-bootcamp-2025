import { Router } from 'express';
import { getStudyActivity, getStudyActivitySessions, createStudyActivity } from '../controllers/study-activities.controller';

const router = Router();

// GET /api/study_activities/:id
router.get('/:id', getStudyActivity);

// GET /api/study_activities/:id/study_sessions
router.get('/:id/study_sessions', getStudyActivitySessions);

// POST /api/study_activities
router.post('/', createStudyActivity);

export default router;
