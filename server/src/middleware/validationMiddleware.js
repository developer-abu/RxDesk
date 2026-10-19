import { errorResponse } from "../utils/responseHelper.js";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return errorResponse(res, 400, formattedErrors[0]?.message || "Validation error", formattedErrors);
    }
    req.body = parsed.data;
    next();
  } catch (error) {
    return errorResponse(res, 400, "Malformed request body");
  }
};

