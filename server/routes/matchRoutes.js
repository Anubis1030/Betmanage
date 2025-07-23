import { Router } from 'express';
import { 
  createMatch, 
  lockMatch, 
  setMatchResult, 
  getActiveMatches 
} from '../controllers/matchController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/active', getActiveMatches);
router.post('/', protect, admin, createMatch);
router.put('/:id/lock', protect, admin, lockMatch);
router.put('/:id/result', protect, admin, setMatchResult);

export default router;