import { Router } from 'express';
import { 
  getAllUsers, 
  toggleUserBlock, 
  generateSettlementReport 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleUserBlock);
router.get('/reports/settlement', protect, admin, generateSettlementReport);

export default router;