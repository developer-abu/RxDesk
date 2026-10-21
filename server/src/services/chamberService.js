import { Chamber } from "../models/Chamber.js";
import { config } from "../config/env.js";

const inMemoryChambers = [];

export const createChamber = async ({ doctorId, chamberData }) => {
  const payload = {
    chamberName: chamberData.chamberName.trim(),
    address: chamberData.address.trim(),
    contactNumber: chamberData.contactNumber.trim(),
    visitingDays: chamberData.visitingDays || [],
    visitingSessions: chamberData.visitingSessions || [],
    doctorName: (chamberData.doctorName || "").trim(),
    qualifications: (chamberData.qualifications || "").trim(),
    registrationNo: (chamberData.registrationNo || "").trim(),
  };

  if (config.isPlaceholder(config.mongodbUri)) {
    const newChamber = {
      _id: "ch_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      doctorId: doctorId.toString(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryChambers.push(newChamber);
    return newChamber;
  }

  const chamber = await Chamber.create({
    doctorId,
    ...payload,
  });

  return chamber;
};

export const getChambers = async (doctorId) => {
  if (config.isPlaceholder(config.mongodbUri)) {
    return inMemoryChambers
      .filter((c) => c.doctorId === doctorId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const chambers = await Chamber.find({ doctorId }).sort({ createdAt: -1 });
  return chambers;
};

export const getChamberById = async ({ chamberId, doctorId }) => {
  if (config.isPlaceholder(config.mongodbUri)) {
    const chamber = inMemoryChambers.find(
      (c) => c._id === chamberId && c.doctorId === doctorId.toString()
    );
    if (!chamber) {
      throw { statusCode: 404, message: "Chamber not found or unauthorized" };
    }
    return chamber;
  }

  const chamber = await Chamber.findById(chamberId);
  if (!chamber) {
    throw { statusCode: 404, message: "Chamber not found" };
  }

  if (chamber.doctorId.toString() !== doctorId.toString()) {
    throw { statusCode: 403, message: "Access forbidden: you do not own this chamber" };
  }

  return chamber;
};
