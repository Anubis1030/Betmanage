import { Router } from 'express';
import { 
  createMatch, 
  lockMatch, 
  setMatchResult, 
  getActiveMatches, 
  getMatchById, 
  getCompletedMatches, 
  getUpcomingMatches 
} from '../controllers/matchController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/active', getActiveMatches);
router.get('/completed', getCompletedMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);
router.post('/', protect, admin, createMatch);
router.put('/:id/lock', protect, admin, lockMatch);
router.put('/:id/result', protect, admin, setMatchResult);

export default router;