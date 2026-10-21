import crypto from "crypto";
import { Doctor } from "../models/Doctor.js";
import { OtpVerification, isOtpBlockedNow } from "../models/OtpVerification.js";
import { hashPassword, comparePassword, hashOtp, compareOtp } from "../utils/passwordUtils.js";
import { signToken } from "../utils/jwtUtils.js";
import { sendOtpEmail, sendAccountCreatedNotification, sendPasswordResetEmail } from "./emailService.js";
import { config } from "../config/env.js";

const inMemoryStore = {
  doctors: new Map(),
  otps: new Map(),
};

export const register = async ({
  fullName,
  mobileNumber,
  email,
  password,
  fullQualification,
  doctorRegistrationNumber,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  if (config.isPlaceholder(config.mongodbUri)) {
    const existingOtp = inMemoryStore.otps.get(normalizedEmail);
    if (existingOtp && existingOtp.isBlocked && existingOtp.blockedUntil > new Date()) {
      throw {
        statusCode: 403,
        message: "This email address is temporarily blocked due to 5 failed verification attempts. Please try again after 24 hours.",
      };
    }
    if (inMemoryStore.doctors.has(normalizedEmail)) {
      throw {
        statusCode: 409,
        message: "An account with this email address already exists. Please log in.",
      };
    }
  } else {
    const existingOtp = await OtpVerification.findOne({
      email: normalizedEmail,
      type: "registration",
    });

    if (existingOtp && isOtpBlockedNow(existingOtp)) {
      throw {
        statusCode: 403,
        message: "This email address is temporarily blocked due to 5 failed verification attempts. Please try again after 24 hours.",
      };
    }

    const existingDoctor = await Doctor.findOne({ email: normalizedEmail });
    if (existingDoctor) {
      throw {
        statusCode: 409,
        message: "An account with this email address already exists. Please log in.",
      };
    }
  }

  const rawOtp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = await hashOtp(rawOtp);
  const hashedPassword = await hashPassword(password);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const pendingData = {
    fullName: fullName.trim(),
    mobileNumber: mobileNumber.trim(),
    passwordHash: hashedPassword,
    fullQualification: fullQualification.trim(),
    doctorRegistrationNumber: doctorRegistrationNumber.trim(),
  };

  if (config.isPlaceholder(config.mongodbUri)) {
    inMemoryStore.otps.set(normalizedEmail, {
      email: normalizedEmail,
      otp: rawOtp,
      hashedOtp,
      type: "registration",
      failedAttempts: 0,
      isBlocked: false,
      blockedUntil: null,
      registrationData: pendingData,
      expiresAt,
    });
  } else {
    await OtpVerification.findOneAndUpdate(
      { email: normalizedEmail, type: "registration" },
      {
        otpHash: hashedOtp,
        registrationData: pendingData,
        expiresAt,
        failedAttempts: 0,
        isBlocked: false,
        blockedUntil: null,
      },
      { upsert: true, new: true }
    );
  }

  await sendOtpEmail({
    to: normalizedEmail,
    doctorName: fullName,
    otp: rawOtp,
    expiresInMinutes: 10,
  });

  return {
    email: normalizedEmail,
    expiresInMinutes: 10,
    message: "A verification code has been sent to your email address.",
  };
};

export const verifyEmail = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let otpRecord = null;
  if (config.isPlaceholder(config.mongodbUri)) {
    otpRecord = inMemoryStore.otps.get(normalizedEmail);
  } else {
    otpRecord = await OtpVerification.findOne({
      email: normalizedEmail,
      type: "registration",
    });
  }

  if (!otpRecord) {
    throw {
      statusCode: 400,
      message: "No pending verification found. Please register again.",
    };
  }

  const isBlocked = config.isPlaceholder(config.mongodbUri)
    ? otpRecord.isBlocked && otpRecord.blockedUntil > new Date()
    : isOtpBlockedNow(otpRecord);

  if (isBlocked) {
    throw {
      statusCode: 403,
      message: "This email address is blocked due to 5 failed verification attempts. Please contact support or try again in 24 hours.",
    };
  }

  if (new Date() > new Date(otpRecord.expiresAt)) {
    throw {
      statusCode: 400,
      message: "The verification code has expired. Please register again to get a new code.",
    };
  }

  const isValid = config.isPlaceholder(config.mongodbUri)
    ? otpRecord.otp === otp || (await compareOtp(otp, otpRecord.hashedOtp))
    : await compareOtp(otp, otpRecord.otpHash);

  if (!isValid) {
    const newFailCount = (otpRecord.failedAttempts || 0) + 1;
    const shouldBlock = newFailCount >= 5;
    const blockTime = shouldBlock ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    if (config.isPlaceholder(config.mongodbUri)) {
      otpRecord.failedAttempts = newFailCount;
      otpRecord.isBlocked = shouldBlock;
      otpRecord.blockedUntil = blockTime;
      inMemoryStore.otps.set(normalizedEmail, otpRecord);
    } else {
      otpRecord.failedAttempts = newFailCount;
      otpRecord.isBlocked = shouldBlock;
      otpRecord.blockedUntil = blockTime;
      await otpRecord.save();
    }

    if (shouldBlock) {
      throw {
        statusCode: 403,
        message: "Too many incorrect attempts. This email has been blocked for 24 hours.",
      };
    }

    const remaining = 5 - newFailCount;
    throw {
      statusCode: 400,
      message: `Invalid verification code. You have ${remaining} attempt(s) remaining.`,
    };
  }

  const { registrationData } = otpRecord;
  let createdDoctor = null;

  if (config.isPlaceholder(config.mongodbUri)) {
    createdDoctor = {
      _id: "doc_" + Date.now(),
      id: "doc_" + Date.now(),
      fullName: registrationData.fullName,
      mobileNumber: registrationData.mobileNumber,
      email: normalizedEmail,
      fullQualification: registrationData.fullQualification,
      doctorRegistrationNumber: registrationData.doctorRegistrationNumber,
      passwordHash: registrationData.passwordHash,
      emailVerified: true,
      failedLoginAttempts: 0,
      lockUntil: null,
      createdAt: new Date(),
    };
    inMemoryStore.doctors.set(normalizedEmail, createdDoctor);
    inMemoryStore.otps.delete(normalizedEmail);
  } else {
    createdDoctor = await Doctor.create({
      fullName: registrationData.fullName,
      mobileNumber: registrationData.mobileNumber,
      email: normalizedEmail,
      passwordHash: registrationData.passwordHash,
      fullQualification: registrationData.fullQualification,
      doctorRegistrationNumber: registrationData.doctorRegistrationNumber,
      emailVerified: true,
    });

    await OtpVerification.deleteOne({ _id: otpRecord._id });
  }

  try {
    const result = await sendAccountCreatedNotification({
      to: normalizedEmail,
      doctorName: createdDoctor.fullName,
      registrationNo: createdDoctor.doctorRegistrationNumber,
    });
    if (!result.success) {
      console.error(`[Email Service]: Account notification failed for ${normalizedEmail}`);
    }
  } catch (error) {
    console.error(`[Email Service]: Account notification failed for ${normalizedEmail}: ${error.message}`);
  }

  const token = signToken({
    id: createdDoctor._id.toString(),
    email: createdDoctor.email,
    fullName: createdDoctor.fullName,
    fullQualification: createdDoctor.fullQualification,
    doctorRegistrationNumber: createdDoctor.doctorRegistrationNumber,
  });

  return {
    doctor: {
      id: createdDoctor._id.toString(),
      fullName: createdDoctor.fullName,
      email: createdDoctor.email,
      mobileNumber: createdDoctor.mobileNumber,
      fullQualification: createdDoctor.fullQualification,
      doctorRegistrationNumber: createdDoctor.doctorRegistrationNumber,
    },
    token,
  };
};

export const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let doctor = null;
  if (config.isPlaceholder(config.mongodbUri)) {
    doctor = inMemoryStore.doctors.get(normalizedEmail);
  } else {
    doctor = await Doctor.findOne({ email: normalizedEmail });
  }

  if (!doctor) {
    throw {
      statusCode: 401,
      message: "Invalid email or password.",
    };
  }

  const isLocked = doctor.lockUntil && new Date(doctor.lockUntil) > new Date();
  if (isLocked) {
    const waitMins = Math.ceil((new Date(doctor.lockUntil) - new Date()) / (60 * 1000));
    throw {
      statusCode: 403,
      message: `Account is temporarily blocked due to 5 failed login attempts. Please try again in ${waitMins} minute(s).`,
    };
  }

  const isPasswordMatch = await comparePassword(password, doctor.passwordHash);

  if (!isPasswordMatch) {
    const newFailCount = (doctor.failedLoginAttempts || 0) + 1;
    const shouldLock = newFailCount >= 5;
    const lockTime = shouldLock ? new Date(Date.now() + 30 * 60 * 1000) : null;

    doctor.failedLoginAttempts = shouldLock ? 0 : newFailCount;
    doctor.lockUntil = lockTime;

    if (config.isPlaceholder(config.mongodbUri)) {
      inMemoryStore.doctors.set(normalizedEmail, doctor);
    } else {
      await doctor.save();
    }

    if (shouldLock) {
      throw {
        statusCode: 403,
        message: "Your account has been temporarily blocked for 30 minutes after 5 incorrect password attempts.",
      };
    }

    const remaining = 5 - newFailCount;
    throw {
      statusCode: 401,
      message: `Invalid email or password. ${remaining} attempt(s) remaining before account lockout.`,
    };
  }

  doctor.failedLoginAttempts = 0;
  doctor.lockUntil = null;
  if (config.isPlaceholder(config.mongodbUri)) {
    inMemoryStore.doctors.set(normalizedEmail, doctor);
  } else {
    await doctor.save();
  }

  const token = signToken({
    id: doctor._id.toString(),
    email: doctor.email,
    fullName: doctor.fullName,
    fullQualification: doctor.fullQualification,
    doctorRegistrationNumber: doctor.doctorRegistrationNumber,
  });

  return {
    doctor: {
      id: doctor._id.toString(),
      fullName: doctor.fullName,
      email: doctor.email,
      mobileNumber: doctor.mobileNumber,
      fullQualification: doctor.fullQualification,
      doctorRegistrationNumber: doctor.doctorRegistrationNumber,
    },
    token,
  };
};

export const forgotPassword = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let doctor = null;
  if (config.isPlaceholder(config.mongodbUri)) {
    doctor = inMemoryStore.doctors.get(normalizedEmail);
  } else {
    doctor = await Doctor.findOne({ email: normalizedEmail });
  }

  if (doctor) {
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (config.isPlaceholder(config.mongodbUri)) {
      inMemoryStore.otps.set(`reset_${normalizedEmail}`, {
        email: normalizedEmail,
        otp: rawOtp,
        hashedOtp,
        type: "password_reset",
        failedAttempts: 0,
        isBlocked: false,
        blockedUntil: null,
        expiresAt,
      });
    } else {
      await OtpVerification.findOneAndUpdate(
        { email: normalizedEmail, type: "password_reset" },
        {
          otpHash: hashedOtp,
          expiresAt,
          failedAttempts: 0,
          isBlocked: false,
          blockedUntil: null,
        },
        { upsert: true, new: true }
      );
    }

    await sendPasswordResetEmail({
      to: normalizedEmail,
      doctorName: doctor.fullName,
      otp: rawOtp,
      expiresInMinutes: 10,
    });
  }

  return {
    message: "If an account exists with that email address, password reset instructions have been sent.",
  };
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let otpRecord = null;
  if (config.isPlaceholder(config.mongodbUri)) {
    otpRecord = inMemoryStore.otps.get(`reset_${normalizedEmail}`);
  } else {
    otpRecord = await OtpVerification.findOne({
      email: normalizedEmail,
      type: "password_reset",
    });
  }

  if (!otpRecord || new Date() > new Date(otpRecord.expiresAt)) {
    throw {
      statusCode: 400,
      message: "Invalid or expired reset code. Please request a new one.",
    };
  }

  if (isOtpBlockedNow(otpRecord)) {
    throw {
      statusCode: 403,
      message: "This reset code is blocked due to too many failed attempts. Request a new code.",
    };
  }

  const isValid = config.isPlaceholder(config.mongodbUri)
    ? otpRecord.otp === otp || (await compareOtp(otp, otpRecord.hashedOtp))
    : await compareOtp(otp, otpRecord.otpHash);

  if (!isValid) {
    otpRecord.failedAttempts = (otpRecord.failedAttempts || 0) + 1;
    otpRecord.isBlocked = otpRecord.failedAttempts >= 5;
    otpRecord.blockedUntil = otpRecord.isBlocked
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : null;

    if (config.isPlaceholder(config.mongodbUri)) {
      inMemoryStore.otps.set(`reset_${normalizedEmail}`, otpRecord);
    } else {
      await otpRecord.save();
    }

    throw {
      statusCode: otpRecord.isBlocked ? 403 : 400,
      message: otpRecord.isBlocked
        ? "Too many incorrect reset codes. Request a new code after 24 hours."
        : "Invalid reset code.",
    };
  }

  const newHash = await hashPassword(newPassword);

  if (config.isPlaceholder(config.mongodbUri)) {
    const doc = inMemoryStore.doctors.get(normalizedEmail);
    if (doc) {
      doc.passwordHash = newHash;
      doc.failedLoginAttempts = 0;
      doc.lockUntil = null;
      inMemoryStore.doctors.set(normalizedEmail, doc);
    }
    inMemoryStore.otps.delete(`reset_${normalizedEmail}`);
  } else {
    await Doctor.updateOne(
      { email: normalizedEmail },
      { passwordHash: newHash, failedLoginAttempts: 0, lockUntil: null }
    );
    await OtpVerification.deleteOne({ _id: otpRecord._id });
  }

  return {
    message: "Password reset successful. You may now log in with your new password.",
  };
};

export const getMe = async (doctorId) => {
  if (config.isPlaceholder(config.mongodbUri)) {
    for (const doc of inMemoryStore.doctors.values()) {
      if (doc._id.toString() === doctorId.toString()) {
        return {
          id: doc._id.toString(),
          fullName: doc.fullName,
          email: doc.email,
          mobileNumber: doc.mobileNumber,
          fullQualification: doc.fullQualification,
          doctorRegistrationNumber: doc.doctorRegistrationNumber,
        };
      }
    }
    return null;
  }

  const doctor = await Doctor.findById(doctorId).select("-passwordHash");
  if (!doctor) return null;

  return {
    id: doctor._id.toString(),
    fullName: doctor.fullName,
    email: doctor.email,
    mobileNumber: doctor.mobileNumber,
    fullQualification: doctor.fullQualification,
    doctorRegistrationNumber: doctor.doctorRegistrationNumber,
  };
};
