import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const registerSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
    ),
  fullQualification: z
    .string({ required_error: "Qualifications are required" })
    .trim()
    .min(2, "Qualification is required (e.g. MBBS, MD)")
    .max(200, "Qualifications cannot exceed 200 characters"),
  doctorRegistrationNumber: z
    .string({ required_error: "Registration number is required" })
    .trim()
    .min(2, "Doctor registration number is required")
    .max(60, "Registration number cannot exceed 60 characters"),
});

export const verifyEmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  otp: z
    .string({ required_error: "OTP is required" })
    .trim()
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  otp: z
    .string({ required_error: "OTP code is required" })
    .trim()
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
    ),
});
