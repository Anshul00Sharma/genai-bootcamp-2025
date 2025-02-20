import { Router } from 'express';
import dashboardRoutes from './dashboard.routes';
import studyActivitiesRoutes from './study-activities.routes';
import wordsRoutes from './words.routes';
import groupsRoutes from './groups.routes';
import studySessionsRoutes from './study-sessions.routes';
import systemRoutes from './system.routes';

const router = Router();

// Mount routes
router.use('/dashboard', dashboardRoutes);
router.use('/study_activities', studyActivitiesRoutes);
router.use('/words', wordsRoutes);
router.use('/groups', groupsRoutes);
router.use('/study_sessions', studySessionsRoutes);

// System routes
router.use('/reset_history', systemRoutes);
router.use('/full_reset', systemRoutes);

export default router;
