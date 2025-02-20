import { Router } from 'express';
import { 
    getStudySessions, 
    getStudySessionById, 
    getStudySessionWords, 
    reviewWord 
} from '../controllers/study-sessions.controller';

const router = Router();

// GET /api/study_sessions
router.get('/', getStudySessions);

// GET /api/study_sessions/:id
router.get('/:id', getStudySessionById);

// GET /api/study_sessions/:id/words
router.get('/:id/words', getStudySessionWords);

// POST /api/study_sessions/:id/words/:word_id/review
router.post('/:id/words/:word_id/review', reviewWord);

export default router;
