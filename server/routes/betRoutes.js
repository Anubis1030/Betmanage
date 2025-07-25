import { Router } from "express";
import { 
  placeBet, 
  getUserBets, 
  getMatchBets, 
  processBets, 
  getAllBets 
} from "../controllers/betControllers.js";
import { protect, admin } from '../middleware/auth.js';
const router = Router();

router.post("/", protect, placeBet);
router.get("/user/:userId", protect, getUserBets);
router.get("/match/:matchId", protect, getMatchBets);
router.post("/process", protect, admin, processBets);
router.get("/", protect, admin, getAllBets);

export default router;
