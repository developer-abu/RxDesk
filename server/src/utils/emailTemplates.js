const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const getGreetingName = (doctorName) => {
  const name = doctorName?.trim();
  if (!name) return "Doctor";
  return escapeHtml(/^dr\.?\s/i.test(name) ? name : `Dr. ${name}`);
};

const renderEmailTemplate = ({ preheader, label, title, greeting, content, notice }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-shell { width: 100% !important; }
      .email-content { padding: 28px 22px !important; }
      .email-header { padding: 22px !important; }
      .email-footer { padding: 20px 22px !important; }
      .otp-code { font-size: 30px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f2f5f7;font-family:Arial,Helvetica,sans-serif;color:#14232b;">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f2f5f7;padding:36px 12px;">
    <tr>
      <td align="center">
        <table class="email-shell" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #dce4e8;border-radius:12px;overflow:hidden;">
          <tr>
            <td class="email-header" style="padding:26px 36px;background-color:#0f5a78;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size:24px;font-weight:700;letter-spacing:-0.5px;color:#ffffff;">RxDesk</div>
                    <div style="margin-top:4px;font-size:13px;line-height:19px;color:#dcecf2;">A simpler workspace for your practice</div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;padding:7px 10px;border:1px solid #6d9eb1;border-radius:20px;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;">${escapeHtml(label)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-content" style="padding:36px;">
              <h1 style="margin:0 0 18px;font-size:24px;line-height:32px;font-weight:700;color:#14232b;">${escapeHtml(title)}</h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:24px;color:#334650;">Hello ${greeting},</p>
              ${content}
              <div style="margin-top:24px;padding:14px 16px;border-left:4px solid #d99825;border-radius:4px;background-color:#fff8e9;color:#67480e;font-size:13px;line-height:20px;">
                ${notice}
              </div>
            </td>
          </tr>
          <tr>
            <td class="email-footer" style="padding:22px 36px;border-top:1px solid #e5eaed;background-color:#f8fafb;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;line-height:18px;color:#52636d;">RxDesk · Doctor prescription workspace</p>
              <p style="margin:0;font-size:11px;line-height:17px;color:#7b8a93;">This is an automated message. Please do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const renderOtpBlock = ({ label, otp, expiresInMinutes }) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
    <tr>
      <td align="center" style="padding:24px 16px;border:1px solid #c8dce5;border-radius:8px;background-color:#f2f8fa;">
        <div style="margin-bottom:10px;color:#52636d;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(label)}</div>
        <div class="otp-code" style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#0f5a78;">${escapeHtml(otp)}</div>
        <div style="margin-top:10px;color:#52636d;font-size:13px;line-height:20px;">This code expires in <strong>${escapeHtml(expiresInMinutes)} minutes</strong>.</div>
      </td>
    </tr>
  </table>
`;

export const getOtpEmailTemplate = ({ doctorName, otp, expiresInMinutes = 10 }) =>
  renderEmailTemplate({
    preheader: "Use your RxDesk verification code to confirm your email address.",
    label: "Email verification",
    title: "Verify your email address",
    greeting: getGreetingName(doctorName),
    content: `
      <p style="margin:0 0 12px;font-size:14px;line-height:23px;color:#334650;">Thanks for creating an RxDesk account. Enter this one-time code in the registration screen to verify your email and complete account setup.</p>
      ${renderOtpBlock({ label: "Your verification code", otp, expiresInMinutes })}
      <p style="margin:0;font-size:13px;line-height:21px;color:#52636d;">For your security, never share this code with anyone. RxDesk support will never ask you to provide it.</p>
    `,
    notice: "If you did not start this registration, you can ignore this message. Your account will not be activated without email verification.",
  });

export const getAccountCreatedEmailTemplate = ({ doctorName, email, registrationNo }) => {
  const registrationRow = registrationNo
    ? `<tr>
        <td style="padding:10px 12px;border-top:1px solid #e5eaed;color:#52636d;font-size:13px;">Registration number</td>
        <td style="padding:10px 12px;border-top:1px solid #e5eaed;color:#14232b;font-size:13px;font-weight:700;">${escapeHtml(registrationNo)}</td>
      </tr>`
    : "";

  return renderEmailTemplate({
    preheader: "Your RxDesk account is verified and ready to use.",
    label: "Account confirmed",
    title: "Your account is ready",
    greeting: getGreetingName(doctorName),
    content: `
      <p style="margin:0 0 20px;font-size:14px;line-height:23px;color:#334650;">Your email has been verified and your RxDesk doctor account is active. You can now set up your chambers and prepare prescriptions.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;border:1px solid #e0e7eb;border-radius:8px;background-color:#f8fafb;">
        <tr>
          <td style="padding:10px 12px;color:#52636d;font-size:13px;">Account name</td>
          <td style="padding:10px 12px;color:#14232b;font-size:13px;font-weight:700;">${getGreetingName(doctorName)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e5eaed;color:#52636d;font-size:13px;">Account email</td>
          <td style="padding:10px 12px;border-top:1px solid #e5eaed;color:#14232b;font-size:13px;font-weight:700;">${escapeHtml(email)}</td>
        </tr>
        ${registrationRow}
      </table>
      <h2 style="margin:24px 0 10px;font-size:16px;line-height:23px;color:#14232b;">Get started</h2>
      <ol style="margin:0;padding-left:22px;color:#334650;font-size:14px;line-height:24px;">
        <li>Add your chamber details and visiting hours.</li>
        <li>Choose a chamber when preparing a prescription.</li>
        <li>Review, print, and sign your prescription.</li>
      </ol>
      <p style="margin:20px 0 0;padding:14px 16px;border-radius:6px;background-color:#eef6f9;color:#315767;font-size:13px;line-height:21px;"><strong>Privacy:</strong> Patient and prescription details are kept in your browser and are not stored on RxDesk servers.</p>
    `,
    notice: "If you did not create this account, please contact RxDesk support so we can help secure it.",
  });
};

export const getPasswordResetEmailTemplate = ({ doctorName, otp, expiresInMinutes = 10 }) =>
  renderEmailTemplate({
    preheader: "Use your RxDesk password reset code to continue.",
    label: "Password reset",
    title: "Reset your password",
    greeting: getGreetingName(doctorName),
    content: `
      <p style="margin:0 0 12px;font-size:14px;line-height:23px;color:#334650;">We received a request to reset the password for your RxDesk account. Enter the one-time code below to continue.</p>
      ${renderOtpBlock({ label: "Your password reset code", otp, expiresInMinutes })}
      <p style="margin:0;font-size:13px;line-height:21px;color:#52636d;">This code can only be used once. Do not share it with anyone.</p>
    `,
    notice: "If you did not request a password reset, ignore this email. Your password will remain unchanged.",
  });
