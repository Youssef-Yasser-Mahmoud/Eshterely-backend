// services/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Password Reset Email
const sendResetEmail = async (email, resetLink) => {
  try {
    console.log("Preparing Bang & Olufsen password reset for:", email);
    console.log("Reset link:", resetLink);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    await transporter.verify();
    console.log("✅ Transporter is ready");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `To reset your Bang & Olufsen account password, please visit: ${resetLink}\n\nIf you didn't request this, please ignore this email.`,
      html: `<p>Reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send password reset:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = {
  sendResetEmail,
};
