// services/emailService.js
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// Email template renderer
const renderEmailTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      `../email-templates/${templateName}.ejs`
    );
    return await ejs.renderFile(templatePath, data);
  } catch (error) {
    console.error("❌ Template rendering failed:", error);
    throw error;
  }
};

// Password Reset Email
const sendResetEmail = async (email, resetLink) => {
  try {
    console.log("🎵 Preparing Bang & Olufsen password reset for:", email);

    await transporter.verify();

    const htmlContent = await renderEmailTemplate("password-reset", {
      resetLink,
      brandName: "Bang & Olufsen",
      supportEmail: "support@bang-olufsen.com",
    });

    const mailOptions = {
      from: `"Bang & Olufsen Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      text: `To reset your Bang & Olufsen account password, please visit: ${resetLink}\n\nIf you didn't request this, please ignore this email.`,
      html: htmlContent,
      headers: {
        "X-Brand": "Bang-&-Olufsen",
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send password reset:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Welcome Email
const sendWelcomeEmail = async (email, userName) => {
  try {
    console.log("🎵 Preparing Bang & Olufsen welcome for:", email);

    await transporter.verify();

    const htmlContent = await renderEmailTemplate("welcome", {
      userName,
      brandName: "Bang & Olufsen",
      supportEmail: "support@bang-olufsen.com",
      loginUrl: `${process.env.FRONTEND_URL}/login`,
      currentYear: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"Bang & Olufsen" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Bang & Olufsen, ${userName}`,
      text: `Dear ${userName},\n\nThank you for joining Bang & Olufsen.\n\nYour account is ready at ${process.env.FRONTEND_URL}/login\n\nFor assistance: support@bang-olufsen.com\n\nBest regards,\nThe Bang & Olufsen Team`,
      html: htmlContent,
      headers: {
        "X-Brand": "Bang-&-Olufsen",
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Welcome email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

module.exports = {
  sendResetEmail,
  sendWelcomeEmail,
  transporter,
};
