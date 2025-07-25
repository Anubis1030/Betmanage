import { Router } from 'express';
import { 
  adjustUserCoins, 
  getUserTransactions 
} from '../controllers/transactionController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.post('/adjust', protect, admin, adjustUserCoins);
router.get('/user/:userId', protect, getUserTransactions);

export default router;