import { Router } from "express";
import { 
  placeBet, 
  getUserBets, 
  getMatchBets, 
  processBets 
} from "../controllers/BetControllers.js";
const router = Router();

router.post("/", placeBet);
router.get("/user/:userId", getUserBets);
router.get("/match/:matchId", getMatchBets);

export default router;
