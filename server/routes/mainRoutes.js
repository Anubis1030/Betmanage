import { Router } from "express";
import userRoutes from "./userRoutes.js";
import matchRoutes from "./matchRoutes.js";
import betRoutes from "./betRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import reportRoutes from "./reportRoutes.js";
const router = Router();

router.use("/users", userRoutes);
router.use("/matches", matchRoutes);
router.use("/bets", betRoutes);
router.use("/transactions", transactionRoutes);
router.use("/reports", reportRoutes);

export default router;
