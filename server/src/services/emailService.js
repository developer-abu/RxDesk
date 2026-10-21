import { config } from "../config/env.js";
import {
  getOtpEmailTemplate,
  getAccountCreatedEmailTemplate,
  getPasswordResetEmailTemplate,
} from "../utils/emailTemplates.js";

const sendGoogleScriptEmail = async ({ to, subject, htmlBody, textBody }) => {
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
      const error = new Error(`Email provider returned HTTP ${response.status}.`);
      error.statusCode = 502;
      throw error;
    }

    return { success: true };
  } catch (error) {
    if (!error.statusCode) error.statusCode = 502;
    throw error;
  }
};

export const sendOtpEmail = async ({ to, doctorName, otp, expiresInMinutes = 10 }) => {
  const htmlBody = getOtpEmailTemplate({ doctorName, otp, expiresInMinutes });
  const textBody = `Hello ${doctorName || "Doctor"},\n\nThanks for creating an RxDesk account. Enter this one-time code in the registration screen to verify your email and complete account setup:\n\n${otp}\n\nThis code expires in ${expiresInMinutes} minutes. Never share it with anyone. If you did not start this registration, ignore this email.\n\nRxDesk`;
  const subject = "Verify your email address for RxDesk";

  return sendGoogleScriptEmail({ to, subject, htmlBody, textBody });
};

export const sendAccountCreatedNotification = async ({ to, doctorName, registrationNo }) => {
  const htmlBody = getAccountCreatedEmailTemplate({ doctorName, email: to, registrationNo });
  const textBody = `Hello ${doctorName || "Doctor"},\n\nYour email has been verified and your RxDesk doctor account is active. You can now set up your chambers and prepare prescriptions.\n\nGet started:\n- Add your chamber details and visiting hours.\n- Choose a chamber when preparing a prescription.\n- Review, print, and sign your prescription.\n\nPatient and prescription details are kept in your browser and are not stored on RxDesk servers.\n\nRxDesk`;
  const subject = "Your RxDesk account is ready";

  return sendGoogleScriptEmail({ to, subject, htmlBody, textBody });
};

export const sendPasswordResetEmail = async ({ to, doctorName, otp, expiresInMinutes = 10 }) => {
  const htmlBody = getPasswordResetEmailTemplate({ doctorName, otp, expiresInMinutes });
  const textBody = `Hello ${doctorName || "Doctor"},\n\nWe received a request to reset the password for your RxDesk account. Enter this one-time code to continue:\n\n${otp}\n\nThis code expires in ${expiresInMinutes} minutes and can only be used once. Do not share it with anyone. If you did not request a password reset, ignore this email; your password will remain unchanged.\n\nRxDesk`;
  const subject = "Your RxDesk password reset code";

  return sendGoogleScriptEmail({ to, subject, htmlBody, textBody });
};
