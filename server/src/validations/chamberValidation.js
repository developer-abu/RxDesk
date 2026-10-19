import { z } from "zod";

export const createChamberSchema = z.object({
  chamberName: z
    .string({ required_error: "Chamber name is required" })
    .trim()
    .min(2, "Chamber name must be at least 2 characters")
    .max(100, "Chamber name cannot exceed 100 characters"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address cannot exceed 300 characters"),
  contactNumber: z
    .string({ required_error: "Contact number is required" })
    .trim()
    .min(6, "Contact number must be at least 6 digits")
    .max(30, "Contact number cannot exceed 30 characters"),
  visitingDays: z
    .array(z.string().trim())
    .min(1, "Select at least one visiting day"),
  visitingHours: z
    .string({ required_error: "Visiting hours are required" })
    .trim()
    .min(2, "Visiting hours are required")
    .max(200, "Visiting hours cannot exceed 200 characters"),
  doctorName: z.string().trim().max(100).optional().default(""),
  qualifications: z.string().trim().max(200).optional().default(""),
  registrationNo: z.string().trim().max(60).optional().default(""),
});

