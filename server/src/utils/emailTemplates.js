/**
 * emailTemplates.js
 *
 * Professional, mobile-responsive HTML email templates for RxDesk:
 * - OTP Verification Email
 * - Welcome & Account Created Notification Email
 * - Password Reset Email
 */

export const getOtpEmailTemplate = ({ doctorName, otp, expiresInMinutes = 10 }) => {
  const safeName = doctorName ? (doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`) : "Doctor";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your RxDesk Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; color: #14232B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #D5DDE3; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(20, 35, 43, 0.04);">
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0F5A78; padding: 24px 32px; text-align: left;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">RxDesk</span>
                    <span style="display: block; font-size: 12px; color: #E6F0F4; margin-top: 2px;">Doctor Prescription Generator</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(255, 255, 255, 0.15); border-radius: 4px; font-size: 11px; font-weight: 600; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px;">Verification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #14232B; line-height: 28px;">
                Verify Your Doctor Account
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #3F4F5A;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #3F4F5A;">
                Thank you for registering with <strong>RxDesk</strong>. To verify your email address and activate your practitioner account, please use the One-Time Password (OTP) below:
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #EEF4F7; border: 1.5px dashed #0F5A78; border-radius: 8px; padding: 20px;">
                    <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #5F6F7A; margin-bottom: 8px;">Your One-Time Password</span>
                    <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #0F5A78;">${otp}</span>
                    <span style="display: block; font-size: 12px; color: #5F6F7A; margin-top: 8px;">Valid for <strong>${expiresInMinutes} minutes</strong></span>
                  </td>
                </tr>
              </table>

              <!-- Security Caution Note -->
              <div style="background-color: #FFF4DB; border-left: 4px solid #8A5A00; padding: 12px 16px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 20px; color: #8A5A00;">
                  <strong>Security Note:</strong> Never share this OTP with anyone. RxDesk support will never call or ask you for your verification code.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #5F6F7A;">
                If you did not initiate this request, you can safely disregard this email. Your email will not be registered without completing this verification.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFB; border-top: 1px solid #D5DDE3; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #7B8A95;">
                RxDesk &bull; Professional Prescription Utility for Doctors in India
              </p>
              <p style="margin: 0; font-size: 11px; color: #8A98A3;">
                Zero Patient Data Persistence Policy &bull; Registered Practitioners Only
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const getAccountCreatedEmailTemplate = ({ doctorName, email, registrationNo }) => {
  const safeName = doctorName ? (doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`) : "Doctor";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to RxDesk - Account Created</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; color: #14232B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #D5DDE3; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(20, 35, 43, 0.04);">
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0F5A78; padding: 24px 32px; text-align: left;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">RxDesk</span>
                    <span style="display: block; font-size: 12px; color: #E6F0F4; margin-top: 2px;">Doctor Prescription Generator</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #1E7B4F; border-radius: 4px; font-size: 11px; font-weight: 600; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px;">Active</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; border-radius: 50%; background-color: #E7F4EC; color: #1E7B4F; font-size: 22px; margin-bottom: 16px;">
                &#10003;
              </div>

              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #14232B; line-height: 28px;">
                Welcome to RxDesk, ${safeName}!
              </h1>

              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #3F4F5A;">
                Your doctor account has been successfully verified and created. You can now configure your clinic chambers and begin generating clean, standard A4 prescriptions in seconds.
              </p>

              <!-- Account Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFB; border: 1px solid #D5DDE3; border-radius: 6px; margin: 20px 0; padding: 16px;">
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #5F6F7A; width: 35%;">Doctor Name:</td>
                  <td style="padding: 6px 12px; font-size: 13px; font-weight: 600; color: #14232B;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #5F6F7A;">Account Email:</td>
                  <td style="padding: 6px 12px; font-size: 13px; font-weight: 600; color: #14232B;">${email}</td>
                </tr>
                ${registrationNo ? `
                <tr>
                  <td style="padding: 6px 12px; font-size: 13px; color: #5F6F7A;">Registration No:</td>
                  <td style="padding: 6px 12px; font-size: 13px; font-weight: 600; color: #14232B;">${registrationNo}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Getting Started Steps -->
              <h2 style="margin: 24px 0 12px 0; font-size: 15px; font-weight: 600; color: #14232B;">
                Getting Started with RxDesk:
              </h2>
              <ol style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 24px; color: #3F4F5A;">
                <li><strong>Add your Chamber(s):</strong> Save clinic name, full address, visiting hours, and phone once.</li>
                <li><strong>Create Prescriptions:</strong> Select your chamber from the dropdown; chamber and doctor details auto-fill instantly.</li>
                <li><strong>Print &amp; Hand-Sign:</strong> Print directly to standard A4 sheets, then apply your physical stamp and signature.</li>
              </ol>

              <!-- Zero Storage Guarantee Highlight -->
              <div style="background-color: #EAF3F8; border-left: 4px solid #0F5A78; padding: 14px 16px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 20px; color: #0F5A78;">
                  <strong>Privacy Guarantee:</strong> Patient names, clinical notes, and medicine entries are kept exclusively in browser memory while you format and print. RxDesk never stores patient data on any server.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFB; border-top: 1px solid #D5DDE3; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #7B8A95;">
                RxDesk &bull; Professional Prescription Utility for Doctors in India
              </p>
              <p style="margin: 0; font-size: 11px; color: #8A98A3;">
                This notification was sent to confirm the registration of ${email}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export const getPasswordResetEmailTemplate = ({ doctorName, otp, expiresInMinutes = 10 }) => {
  const safeName = doctorName ? (doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`) : "Doctor";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your RxDesk Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; color: #14232B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #D5DDE3; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(20, 35, 43, 0.04);">
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0F5A78; padding: 24px 32px; text-align: left;">
              <span style="font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">RxDesk</span>
              <span style="display: block; font-size: 12px; color: #E6F0F4; margin-top: 2px;">Password Recovery</span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #14232B; line-height: 28px;">
                Password Reset Request
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #3F4F5A;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #3F4F5A;">
                We received a request to reset your password for your RxDesk doctor account. Use the verification code below to authorize the password change:
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #EEF4F7; border: 1.5px dashed #0F5A78; border-radius: 8px; padding: 20px;">
                    <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #5F6F7A; margin-bottom: 8px;">Password Reset Code</span>
                    <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #0F5A78;">${otp}</span>
                    <span style="display: block; font-size: 12px; color: #5F6F7A; margin-top: 8px;">Expires in <strong>${expiresInMinutes} minutes</strong></span>
                  </td>
                </tr>
              </table>

              <!-- Security Caution Note -->
              <div style="background-color: #FDECEA; border-left: 4px solid #B42318; padding: 12px 16px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 20px; color: #912018;">
                  <strong>Important:</strong> If you did not request this password reset, please contact support immediately or change your email account password.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFB; border-top: 1px solid #D5DDE3; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #7B8A95;">
                RxDesk &bull; Professional Prescription Utility for Doctors in India
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

