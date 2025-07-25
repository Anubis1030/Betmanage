import { Router } from "express";
import { registerUser, loginUser, getUserStats, getUserActivity, getUserTransactions, getUserNotifications, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/:id/stats", protect, getUserStats);
router.get("/:id/activity", protect, getUserActivity);
router.get("/:id/transactions", protect, getUserTransactions);
router.get("/:id/notifications", protect, getUserNotifications);

export default router;