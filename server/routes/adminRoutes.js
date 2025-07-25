import { Router } from 'express';
import { 
  getAllUsers, 
  toggleUserBlock, 
  generateSettlementReport, 
  getAdminStats, 
  getRecentBets 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleUserBlock);
router.get('/reports/settlement', protect, admin, generateSettlementReport);
router.get('/stats', protect, admin, getAdminStats);
router.get('/bets/recent', protect, admin, getRecentBets);

export default router;