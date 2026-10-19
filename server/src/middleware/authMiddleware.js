import { verifyToken } from "../utils/jwtUtils.js";
import { Doctor, isDoctorLocked } from "../models/Doctor.js";
import { errorResponse } from "../utils/responseHelper.js";
import { config } from "../config/env.js";

export const authenticate = async (req, res, next) => {
  try {
    // Read JWT from HTTP-only cookie first, fallback to Authorization header
    let token = req.cookies?.rxdesk_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, 401, "Authentication required. Please log in.");
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return errorResponse(res, 401, "Session expired or invalid. Please log in again.");
    }

    // In database placeholder mode, allow authenticated session passing through mock context
    if (config.isPlaceholder(config.mongodbUri)) {
      req.doctor = {
        _id: decoded.id,
        id: decoded.id,
        fullName: decoded.fullName || "Dr. Practitioner",
        email: decoded.email,
        fullQualification: decoded.fullQualification || "MBBS",
        doctorRegistrationNumber: decoded.doctorRegistrationNumber || "REG-12345",
      };
      return next();
    }

    const doctor = await Doctor.findById(decoded.id).select("-passwordHash");
    if (!doctor) {
      return errorResponse(res, 401, "Account not found or session revoked.");
    }

    if (isDoctorLocked(doctor)) {
      return errorResponse(
        res,
        403,
        "Account is temporarily locked due to multiple failed login attempts. Please try again later."
      );
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Authentication failed.");
  }
};
