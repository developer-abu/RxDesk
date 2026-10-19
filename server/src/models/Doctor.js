import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    fullQualification: {
      type: String,
      required: [true, "Qualifications are required"],
      trim: true,
      maxlength: [200, "Qualifications cannot exceed 200 characters"],
    },
    doctorRegistrationNumber: {
      type: String,
      required: [true, "Doctor registration number is required"],
      trim: true,
      maxlength: [60, "Registration number cannot exceed 60 characters"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Arrow helper to verify if doctor account is locked due to failed attempts
export const isDoctorLocked = (doctor) => {
  return !!(doctor && doctor.lockUntil && new Date(doctor.lockUntil) > new Date());
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
