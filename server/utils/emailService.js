const nodemailer = require("nodemailer");
const axios = require("axios");

// Create reusable transporter
let transporter = null;
let smtpVerified = false;

const initializeTransporter = async () => {
  // Only attempt SMTP if credentials are provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure:
          process.env.SMTP_SECURE === "true" ||
          parseInt(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Verify SMTP connectivity
      try {
        await transporter.verify();
        smtpVerified = true;
        console.log("✅ Email Transporter Initialized & Verified");
      } catch (verifyError) {
        console.warn(
          "⚠️ SMTP connection failed:",
          verifyError.message,
        );
        console.log("ℹ️ Will fallback to Google Apps Script Proxy for emails.");
        smtpVerified = false;
      }
    } catch (error) {
      console.error(
        "❌ Failed to initialize email transporter:",
        error.message,
      );
    }
  } else {
    console.warn(
      "⚠️ SMTP credentials missing. Email service will use Proxy or Log-only mode.",
    );
  }
};

/**
 * Helper to send email via Google Apps Script Proxy (Bypasses SMTP blocks)
 */
const sendViaProxy = async (mailOptions) => {
  const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!APPS_SCRIPT_URL) {
    console.error("❌ GOOGLE_APPS_SCRIPT_URL is missing in .env");
    return false;
  }

  try {
    console.log(`📡 Sending email to ${mailOptions.to} via Apps Script Proxy...`);
    const response = await axios.post(APPS_SCRIPT_URL, {
      action: "SEND_EMAIL",
      to: mailOptions.to,
      cc: mailOptions.cc,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });

    if (response.data && response.data.success) {
      console.log(`✅ Email sent successfully via Proxy to ${mailOptions.to}`);
      return true;
    } else {
      console.error(
        "❌ Apps Script Email Error:",
        response.data?.message || "Unknown error",
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Proxy Email Error:", error.message);
    return false;
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

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("\n========================================");
    console.log("📧 EMAIL OTP SERVICE (Log only)");
    console.log(`To: ${email} | OTP: ${otp}`);
    console.log("========================================\n");
  }

  // Priority 1: SMTP (if verified and working)
  if (smtpVerified && transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent via SMTP to ${email}`);
      return true;
    } catch (error) {
      console.error("❌ SMTP send failed, trying Proxy...", error.message);
    }
  }

  // Priority 2: HTTP Proxy (Bypass Render block)
  const result = await sendViaProxy(mailOptions);
  
  if (!result) {
    // If proxy failed on Render, it's a hard failure regardless of NODE_ENV
    if (process.env.RENDER || process.env.NODE_ENV === "production") {
      return false;
    }
    // Only in local dev (no RENDER env) we allow the flow to continue
    return true;
  }

  return result;
};

/**
 * Send welcome email after successful registration
 */
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
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
      </div>
    `,
  };

  if (smtpVerified && transporter) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (e) {}
  }
  await sendViaProxy(mailOptions);
};

/**
 * Send order confirmation email to user
 */
const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName} (x${item.quantity})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `,
    )
    .join("");

  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
    to: user.email,
    cc: "samdev0418@gmail.com",
    subject: `Order Confirmed: ${order.orderId} - Le Pondicherry Cheese`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2C5530;">Order Confirmation</h2>
        <p>Hi ${user.name || "Customer"},</p>
        <p>Thank you for your order! We've received your payment and are preparing your delicious cheese.</p>
        <div style="background: #FAF7F2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">₹${order.finalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `,
  };

  if (smtpVerified && transporter) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (e) {}
  }
  await sendViaProxy(mailOptions);
};

/**
 * Send shipping update email to user
 */
const sendShippingUpdateEmail = async (order, user) => {
  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Your cheese is on its way! 🚚 - Order ${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2C5530;">Order Dispatched!</h2>
        <p>Hi ${user.name || "Customer"},</p>
        <p>Good news! Your order <strong>${order.orderId}</strong> has been shipped and is on its way to you.</p>
        <div style="background: #FAF7F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Courier:</strong> ${order.courierPartner}</p>
          <p><strong>Tracking Number:</strong> <span style="font-size: 18px; font-weight: bold; color: #C9A961;">${order.trackingNumber}</span></p>
        </div>
      </div>
    `,
  };

  if (smtpVerified && transporter) {
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (e) {}
  }
  await sendViaProxy(mailOptions);
};

// Initialize on module load
initializeTransporter().catch((err) =>
  console.error("❌ Email transporter initialization error:", err.message),
);

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendShippingUpdateEmail,
  initializeTransporter,
};
