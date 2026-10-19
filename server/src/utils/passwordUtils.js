import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const hashOtp = async (plainOtp) => {
  return await bcrypt.hash(plainOtp.toString(), 10);
};

export const compareOtp = async (plainOtp, hashedOtp) => {
  return await bcrypt.compare(plainOtp.toString(), hashedOtp);
};

