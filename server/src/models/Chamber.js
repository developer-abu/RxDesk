import mongoose from "mongoose";

const chamberSchema = new mongoose.Schema(
  {
    chamberName: {
      type: String,
      required: [true, "Chamber name is required"],
      trim: true,
      maxlength: [100, "Chamber name cannot exceed 100 characters"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, "Chamber address is required"],
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      maxlength: [30, "Contact number cannot exceed 30 characters"],
    },
    visitingDays: {
      type: [String],
      default: [],
    },
    visitingHours: {
      type: String,
      required: [true, "Visiting hours are required"],
      trim: true,
      maxlength: [200, "Visiting hours cannot exceed 200 characters"],
    },
    doctorName: {
      type: String,
      trim: true,
      default: "",
    },
    qualifications: {
      type: String,
      trim: true,
      default: "",
    },
    registrationNo: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying doctor's chambers sorted by creation
chamberSchema.index({ doctorId: 1, createdAt: -1 });

export const Chamber = mongoose.model("Chamber", chamberSchema);

