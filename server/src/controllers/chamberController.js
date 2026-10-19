import * as chamberService from "../services/chamberService.js";
import { successResponse } from "../utils/responseHelper.js";

export const handleCreateChamber = async (req, res, next) => {
  try {
    const doctorId = req.doctor._id || req.doctor.id;
    const chamber = await chamberService.createChamber({
      doctorId,
      chamberData: req.body,
    });

    return successResponse(res, 201, "Chamber created successfully.", { chamber });
  } catch (error) {
    next(error);
  }
};

export const handleGetChambers = async (req, res, next) => {
  try {
    const doctorId = req.doctor._id || req.doctor.id;
    const chambers = await chamberService.getChambers(doctorId);

    return successResponse(res, 200, "Chambers retrieved successfully.", { chambers });
  } catch (error) {
    next(error);
  }
};

export const handleGetChamber = async (req, res, next) => {
  try {
    const doctorId = req.doctor._id || req.doctor.id;
    const { chamberId } = req.params;

    const chamber = await chamberService.getChamberById({ chamberId, doctorId });

    return successResponse(res, 200, "Chamber retrieved successfully.", { chamber });
  } catch (error) {
    next(error);
  }
};

