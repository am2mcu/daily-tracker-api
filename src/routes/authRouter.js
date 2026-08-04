import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyAccount,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.get("/verify-account/:token", verifyAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
