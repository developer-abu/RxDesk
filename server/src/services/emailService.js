import { config } from "../config/env.js";
import {
  getOtpEmailTemplate,
  getAccountCreatedEmailTemplate,
  getPasswordResetEmailTemplate,
} from "../utils/emailTemplates.js";

/**
 * Sends email via Google Apps Script Web App or logs to console if placeholder/development
 */
const sendGoogleScriptEmail = async ({ to, subject, htmlBody, textBody }) => {
  // If Google Script URL is placeholder (##########) or missing, log simulation
  if (config.isPlaceholder(config.googleScriptEmailUrl)) {
    console.log(
      "\n=======================================================\n" +
      `[Email Service (Placeholder Mode)]: Email to ${to}\n` +
      `Subject: ${subject}\n` +
      `Content preview: ${textBody?.slice(0, 160) || "HTML Template Ready"}...\n` +
      "[Notice]: Set GOOGLE_SCRIPT_EMAIL_URL in .env to dispatch live emails via Google Script.\n" +
      "=======================================================\n"
    );
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(config.googleScriptEmailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        htmlBody,
        textBody: textBody || "Please view this email in an HTML-compatible client.",
      }),
    });

    if (!response.ok) {
      console.error(`[Email Service]: Google Script returned HTTP ${response.status}`);
      return { success: false, error: `Google Script status: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error(`[Email Service Error]: Failed to send via Google Script: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const sendOtpEmail = async ({ to, doctorName, otp, expiresInMinutes = 10 }) => {
  const htmlBody = getOtpEmailTemplate({ doctorName, otp, expiresInMinutes });
  const textBody = `Hello ${doctorName || "Doctor"},\n\nYour RxDesk verification code is: ${otp}\nThis code is valid for ${expiresInMinutes} minutes.\n\nRxDesk Team`;
  const subject = `Your RxDesk Verification Code: ${otp}`;

  return await sendGoogleScriptEmail({ to, subject, htmlBody, textBody });
};

export const sendAccountCreatedNotification = async ({ to, doctorName, registrationNo }) => {
  const htmlBody = getAccountCreatedEmailTemplate({ doctorName, email: to, registrationNo });
  const textBody = `Welcome to RxDesk, ${doctorName || "Doctor"}!\n\nYour practitioner account has been successfully created and verified.\nYou can now log in to manage your chambers and create prescriptions.\n\nRxDesk Team`;
  const subject = "Welcome to RxDesk — Your Account is Ready";

  return await sendGoogleScriptEmail({ to, subject, htmlBody, textBody });
};

export const sendPasswordResetEmail = async ({ to, doctorName, otp, expiresInMinutes = 10 }) => {
  const htmlBody = getPasswordResetEmailTemplate({ doctorName, otp, expiresInMinutes });
  const textBody = `Hello ${doctorName || "Doctor"},\n\nYour RxDesk password reset code is: ${otp}\nThis code expires in ${expiresInMinutes} minutes.\n\nRxDesk Team`;
  const subject = `RxDesk Password Reset Code: ${otp}`;

  return await sendGoogleScriptEmail({ to, subject, htmlBody, textBody });
};

