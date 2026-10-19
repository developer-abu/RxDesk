import dotenv from "dotenv";

dotenv.config();

const PLACEHOLDER = "##########";

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI || PLACEHOLDER,
  jwtSecret: process.env.JWT_SECRET || PLACEHOLDER,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleScriptEmailUrl: process.env.GOOGLE_SCRIPT_EMAIL_URL || PLACEHOLDER,
  isPlaceholder: (val) => !val || val === PLACEHOLDER,
};

