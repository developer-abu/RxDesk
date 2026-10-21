import dotenv from "dotenv";

dotenv.config();

const PLACEHOLDER = "##########";
const nodeEnv = process.env.NODE_ENV || "development";
const mongodbUri = process.env.MONGODB_URI || PLACEHOLDER;
const jwtSecret = process.env.JWT_SECRET || PLACEHOLDER;
const googleScriptEmailUrl = process.env.GOOGLE_SCRIPT_EMAIL_URL || PLACEHOLDER;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

if (
  nodeEnv === "production" &&
  (mongodbUri === PLACEHOLDER ||
    jwtSecret === PLACEHOLDER ||
    googleScriptEmailUrl === PLACEHOLDER ||
    !process.env.CLIENT_URL ||
    !clientUrl.startsWith("https://"))
) {
  throw new Error(
    "Production requires MONGODB_URI, JWT_SECRET, GOOGLE_SCRIPT_EMAIL_URL, and an HTTPS CLIENT_URL."
  );
}

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv,
  clientUrl,
  mongodbUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleScriptEmailUrl,
  isPlaceholder: (val) => !val || val === PLACEHOLDER,
};
