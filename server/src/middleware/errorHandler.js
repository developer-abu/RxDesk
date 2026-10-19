import { errorResponse } from "../utils/responseHelper.js";
import { config } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  // Safe logging: never log authorization tokens, cookies or passwords
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid resource identifier format");
  }

  if (err.code === 11000) {
    return errorResponse(res, 409, "An account with this email address already exists.");
  }

  const statusCode = err.statusCode || 500;
  const message =
    config.nodeEnv === "production" && statusCode === 500
      ? "An unexpected error occurred. Please try again later."
      : err.message || "Internal server error";

  return errorResponse(res, statusCode, message);
};

