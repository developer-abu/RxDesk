import { errorResponse } from "../utils/responseHelper.js";

const FORBIDDEN_FIELDS = [
  "patientName",
  "patient_name",
  "patientAge",
  "patientGender",
  "chiefComplaints",
  "clinicalNotes",
  "diagnosis",
  "medicines",
  "medicine",
  "prescription",
  "prescriptions",
  "advice",
  "followUp",
];

export const forbidPrescriptionStorage = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    const keys = Object.keys(req.body);
    const hasForbiddenField = keys.some((key) =>
      FORBIDDEN_FIELDS.includes(key.toLowerCase()) ||
      FORBIDDEN_FIELDS.some((forbidden) => key.toLowerCase().includes(forbidden.toLowerCase()))
    );

    if (hasForbiddenField) {
      return errorResponse(
        res,
        400,
        "Architectural Security Violation: RxDesk strictly prohibits transmitting or persisting patient or clinical prescription data on the server."
      );
    }
  }
  next();
};

