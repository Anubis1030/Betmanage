import { Router } from 'express';
import { 
  createReport, 
  getReports, 
  updateReportStatus 
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createReport);
router.get('/', protect, admin, getReports);
router.put('/:id', protect, admin, updateReportStatus);

export default router;