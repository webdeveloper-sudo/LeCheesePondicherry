const nodemailer = require("nodemailer");

// Create reusable transporter
let transporter = null;

const initializeTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === "true" || parseInt(process.env.SMTP_PORT) === 465, // true for port 465 (SSL), false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          // Do not fail on invalid certs in production cloud environments
          rejectUnauthorized: false,
        },
      });
      console.log("✅ Email Transporter Initialized");

      // Verify SMTP connectivity on startup
      try {
        await transporter.verify();
        console.log("✅ SMTP connection verified — email service is ready.");
      } catch (verifyError) {
        console.error(
          "❌ SMTP connection verification failed:",
          verifyError.message,
        );
        console.error(
          "   Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and ensure the hosting provider allows outbound SMTP on the configured port.",
        );
        transporter = null; // Reset so we don't send on a broken transporter
      }
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

  // No transporter available
  if (process.env.NODE_ENV === "production") {
    // In production, fail loudly so the issue is immediately visible in server logs
    console.error(
      "❌ OTP email could not be sent: SMTP transporter is not initialized. " +
      "Ensure SMTP_HOST, SMTP_PORT (use 465), SMTP_SECURE (set to true), SMTP_USER, and SMTP_PASS are correctly set in your hosting environment.",
    );
    return false;
  }

  // In development with no transporter, we already logged the OTP to console — keep flow moving
  return true;
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

/**
 * Send order confirmation email to user
 * @param {Object} order - Order details
 * @param {Object} user - User details
 */
const sendOrderConfirmationEmail = async (order, user) => {
  if (!transporter) return;

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

  try {
    await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
      to: user.email,
      cc: "samdev0418@gmail.com", // Keeping admin in the loop
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

          <div style="margin-top: 30px;">
            <p><strong>Shipping to:</strong></p>
            <p>${order.deliveryAddress.addressLine1}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}</p>
          </div>

          <p style="margin-top: 30px;">We'll notify you once your order is shipped!</p>
        </div>
      `,
    });
    console.log(`✅ Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Order confirmation email failed:", error.message);
  }
};

/**
 * Send shipping update email to user
 */
const sendShippingUpdateEmail = async (order, user) => {
  if (!transporter) return;

  try {
    await transporter.sendMail({
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
            ${order.estimatedDeliveryDate ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}</p>` : ""}
          </div>

          <p>You can track your order on the ${order.courierPartner} website.</p>
          
          <div style="text-align: center; margin: 30px 0;">
             <a href="${process.env.FRONTEND_URL}/user" style="background: #2C5530; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order Details</a>
          </div>
        </div>
      `,
    });
    console.log(`✅ Shipping update email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Shipping update email failed:", error.message);
  }
};

// Initialize on module load (async — SMTP verify runs in background)
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
