import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
