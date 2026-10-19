import * as authService from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { config } from "../config/env.js";

const COOKIE_NAME = "rxdesk_token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: config.nodeEnv === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

export const handleRegister = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, 200, result.message, {
      email: result.email,
      expiresInMinutes: result.expiresInMinutes,
    });
  } catch (error) {
    next(error);
  }
};

export const handleVerifyEmail = async (req, res, next) => {
  try {
    const { doctor, token } = await authService.verifyEmail(req.body);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return successResponse(res, 201, "Account successfully verified and created.", {
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogin = async (req, res, next) => {
  try {
    const { doctor, token } = await authService.login(req.body);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return successResponse(res, 200, "Login successful.", {
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "strict" : "lax",
      path: "/",
    });

    return successResponse(res, 200, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
};

export const handleGetMe = async (req, res, next) => {
  try {
    // req.doctor is populated by authenticate middleware
    const doctor = {
      id: req.doctor._id ? req.doctor._id.toString() : req.doctor.id,
      fullName: req.doctor.fullName,
      email: req.doctor.email,
      fullQualification: req.doctor.fullQualification,
      doctorRegistrationNumber: req.doctor.doctorRegistrationNumber,
    };

    return successResponse(res, 200, "Authenticated doctor profile", { doctor });
  } catch (error) {
    next(error);
  }
};

export const handleForgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

export const handleResetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

