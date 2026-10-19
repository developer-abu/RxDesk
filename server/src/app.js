import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import chamberRoutes from "./routes/chamberRoutes.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import { forbidPrescriptionStorage } from "./middleware/securityGuardMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { errorResponse, successResponse } from "./utils/responseHelper.js";

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing with HTTP-only Cookie Credentials
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body & Cookie Parsing (10kb limit protects against payload attacks)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// 4. Global API Rate Limiting
app.use("/api", apiLimiter);

// 5. Architectural Security Guard: Forbid any patient/prescription persistence
app.use("/api", forbidPrescriptionStorage);

// 6. Health Check Endpoint
app.get("/api/health", (req, res) => {
  return successResponse(res, 200, "RxDesk API is healthy", {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    databaseMode: config.isPlaceholder(config.mongodbUri) ? "standalone_placeholder" : "connected",
    emailService: config.isPlaceholder(config.googleScriptEmailUrl) ? "placeholder_simulation" : "google_script",
  });
});

// 7. Core Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/chambers", chamberRoutes);

// 8. 404 Route Handler
app.use("*", (req, res) => {
  return errorResponse(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
});

// 9. Centralized Error Handler
app.use(errorHandler);

export default app;

