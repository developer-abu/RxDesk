import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const getSecret = () => {
  if (config.isPlaceholder(config.jwtSecret)) {
    return "rxdesk_dev_jwt_secret_change_in_production_key_2026";
  }
  return config.jwtSecret;
};

export const signToken = (payload) => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
};

