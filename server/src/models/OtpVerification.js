import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["registration", "password_reset"],
      default: "registration",
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
    registrationData: {
      fullName: { type: String },
      passwordHash: { type: String },
      fullQualification: { type: String },
      doctorRegistrationNumber: { type: String },
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Arrow helper to check if email is currently blocked due to OTP failures
export const isOtpBlockedNow = (record) => {
  if (!record) return false;
  if (record.isBlocked) return true;
  if (record.blockedUntil && new Date(record.blockedUntil) > new Date()) return true;
  return false;
};

export const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);
