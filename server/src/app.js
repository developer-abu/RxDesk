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
import { enforceTrustedOrigin } from "./middleware/originMiddleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use("/api", enforceTrustedOrigin);

app.use("/api", apiLimiter);

app.use("/api", forbidPrescriptionStorage);

app.get("/api/health", (req, res) => {
  return successResponse(res, 200, "RxDesk API is healthy", {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    databaseMode: config.isPlaceholder(config.mongodbUri) ? "standalone_placeholder" : "connected",
    emailService: config.isPlaceholder(config.googleScriptEmailUrl) ? "placeholder_simulation" : "google_script",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chambers", chamberRoutes);

app.use("*", (req, res) => {
  return errorResponse(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
});

app.use(errorHandler);

export default app;
