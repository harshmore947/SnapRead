import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("\n=======================================================");
    console.log("               PASSWORD RESET LINK (DEV)              ");
    console.log("=======================================================");
    console.log(`Recipient: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("=======================================================\n");
    return { success: true, preview: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SnapRead" <no-reply@snapread.ai>`,
      to: email,
      subject: "Reset your SnapRead password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your SnapRead password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fff1f2; margin: 0; padding: 40px 20px;">
          <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ffe4e6; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(244, 63, 94, 0.08);">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 24px; font-weight: 700; color: #881337; letter-spacing: -0.5px;">SnapRead</span>
            </div>
            <h1 style="color: #4c0519; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">Reset your password</h1>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
              We received a request to reset your password for your SnapRead account. Click the button below to set a new password. This link will expire in 1 hour.
            </p>
            <div style="margin-bottom: 32px;">
              <a href="${resetUrl}" style="background-color: #e11d48; color: #ffffff; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block; box-shadow: 0 2px 8px rgba(225, 29, 72, 0.25);">Reset Password</a>
            </div>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-bottom: 12px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #e11d48; font-size: 12px; word-break: break-all; margin-bottom: 32px;">
              ${resetUrl}
            </p>
            <hr style="border: none; border-top: 1px solid #fecdd3; margin-bottom: 20px;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
