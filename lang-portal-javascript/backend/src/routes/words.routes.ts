import { Router } from 'express';
import { 
    getWords, 
    getWordById 
} from '../controllers/words.controller';

const router = Router();

// GET /api/words
router.get('/', getWords);

// GET /api/words/:id
router.get('/:id', getWordById);

export default router;
