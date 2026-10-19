import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { loginRateLimiter, otpRateLimiter } from "../middleware/rateLimitMiddleware.js";
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), authController.handleRegister);

router.post(
  "/verify-email",
  otpRateLimiter,
  validateRequest(verifyEmailSchema),
  authController.handleVerifyEmail
);

router.post(
  "/login",
  loginRateLimiter,
  validateRequest(loginSchema),
  authController.handleLogin
);

router.post("/logout", authController.handleLogout);

router.get("/me", authenticate, authController.handleGetMe);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.handleForgotPassword
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.handleResetPassword
);

export default router;

