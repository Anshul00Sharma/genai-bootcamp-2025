import { Router } from 'express';
import { 
  getGroups,
  getGroupById, 
  getGroupWords, 
  getGroupStudySessions,

} from '../controllers/groups.controller';

const router = Router();

// GET /api/groups
router.get('/', getGroups);

// GET /api/groups/:id
router.get('/:id', getGroupById);

// GET /api/groups/:id/words
router.get('/:id/words', getGroupWords);

// GET /api/groups/:id/study_sessions
router.get('/:id/study_sessions', getGroupStudySessions);

export default router;
