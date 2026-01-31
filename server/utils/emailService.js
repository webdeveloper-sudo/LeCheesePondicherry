const nodemailer = require("nodemailer");

// Create reusable transporter
let transporter = null;

const initializeTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587/25
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log("✅ Email Transporter Initialized");
    } catch (error) {
      console.error(
        "❌ Failed to initialize email transporter:",
        error.message,
      );
    }
  } else {
    console.warn(
      "⚠️ SMTP credentials missing. Email service will run in log-only mode.",
    );
  }
};

/**
 * Send OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @param {string} purpose - Purpose of OTP (signup, reset-password, etc.)
 * @returns {Promise<boolean>} Success status
 */
const sendOTPEmail = async (email, otp, purpose = "signup") => {
  const subjects = {
    signup: "Verify Your Email - Le Pondicherry Cheese",
    "reset-password": "Reset Your Password - Le Pondicherry Cheese",
    "verify-email": "Email Verification - Le Pondicherry Cheese",
  };

  // For development: Log OTP to console
  console.log("\n========================================");
  console.log("📧 EMAIL OTP SERVICE");
  console.log("========================================");
  console.log(`To: ${email}`);
  console.log(`Purpose: ${purpose}`);
  console.log(`OTP: ${otp}`);
  console.log(`Expires in: 10 minutes`);
  console.log("========================================\n");

  // For production with SMTP configured
  if (transporter) {
    try {
      const mailOptions = {
        from:
          process.env.SMTP_FROM ||
          `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subjects[purpose] || "Your OTP - Le Pondicherry Cheese",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2C5530; margin: 0;">Le Pondicherry Cheese</h1>
              <p style="color: #C9A961; font-weight: bold; margin: 5px 0; text-transform: uppercase; letter-spacing: 2px;">Premium Artisan Cheese</p>
            </div>
            
            <div style="background: #FAF7F2; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #2C5530; margin-bottom: 20px;">Your Verification Code</h2>
              <div style="background: #2C5530; color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; display: inline-block;">
                ${otp}
              </div>
              <p style="color: #666; margin-top: 20px; font-size: 16px;">This code is valid for <strong>10 minutes</strong>.</p>
            </div>
            
            <div style="margin-top: 30px; color: #444; line-height: 1.6;">
              <p>Hello,</p>
              <p>Please use the code above to complete your ${purpose.replace("-", " ")} process. For security reasons, do not share this code with anyone.</p>
              <p>If you did not request this code, you can safely ignore this email.</p>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Le Pondicherry Cheese. All rights reserved.</p>
              <p>Achariya Campus, Villupuram Main Road, Pondicherry.</p>
            </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(
        `✅ Email sent successfully to ${email}. MessageId: ${info.messageId}`,
      );
      return true;
    } catch (error) {
      console.error("❌ Email sending failed:", error.message);
      return false;
    }
  }

  // If no transporter but in development, we logged it, so return true to keep flow moving
  return process.env.NODE_ENV === "development";
};

/**
 * Send welcome email after successful registration
 * @param {string} email - User's email
 * @param {string} name - User's name
 */
const sendWelcomeEmail = async (email, name) => {
  console.log("\n========================================");
  console.log("📧 WELCOME EMAIL");
  console.log("========================================");
  console.log(`To: ${email}`);
  console.log(`Welcome message sent to: ${name || "Cheese Lover"}`);
  console.log("========================================\n");

  if (transporter) {
    try {
      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to Le Pondicherry Cheese! 🧀",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2C5530; margin: 0;">Le Pondicherry Cheese</h1>
            </div>
            <h2 style="color: #2C5530;">Welcome, ${name || "Cheese Lover"}!</h2>
            <p style="line-height: 1.6; color: #444;">Thank you for joining Le Pondicherry Cheese. We're excited to have you as part of our artisan cheese community!</p>
            <p style="line-height: 1.6; color: #444;">Start exploring our premium collection of handcrafted cheeses made with love and tradition.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/shop" 
                 style="background: #2C5530; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Explore Our Collection
              </a>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 40px;">
              If you have any questions, feel free to reply to this email.
            </p>
          </div>
        `,
      });
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error("❌ Welcome email failed:", error.message);
    }
  }
};

// Initialize on module load
initializeTransporter();

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  initializeTransporter,
};
