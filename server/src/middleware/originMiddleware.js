import { config } from "../config/env.js";
import { errorResponse } from "../utils/responseHelper.js";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const enforceTrustedOrigin = (req, res, next) => {
  if (!UNSAFE_METHODS.has(req.method)) return next();

  const origin = req.get("origin");
  const hasSessionCookie = Boolean(req.cookies?.rxdesk_token);

  if (origin && origin !== config.clientUrl) {
    return errorResponse(res, 403, "Request origin is not allowed.");
  }

  if (config.nodeEnv === "production" && hasSessionCookie && origin !== config.clientUrl) {
    return errorResponse(res, 403, "A trusted request origin is required.");
  }

  return next();
};
