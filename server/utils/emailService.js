const nodemailer = require("nodemailer");

// Admin emails for system notification recipients
const ADMIN_EMAILS = [
  "accounts@lepondicheese.com",
  "vp.expansions@hopemarket.in",
  "webdeveloper@achariya.org",
];

// Create reusable transporter
let transporter = null;
let smtpVerified = false;

const initializeTransporter = async () => {
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
        console.log("✅ Email Transporter Initialized & Verified via Nodemailer SMTP");
      } catch (verifyError) {
        console.warn("⚠️ SMTP connection failed:", verifyError.message);
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
      "⚠️ SMTP credentials missing. Email service will run in Log-only mode in development.",
    );
  }
};

/**
 * Unified helper to send email via direct Nodemailer SMTP
 */
const sendEmailHelper = async (mailOptions) => {
  console.log("📨 Mode: nodemailer. Routing via direct SMTP...");
  if (!transporter) {
    await initializeTransporter();
  }

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent via SMTP to ${mailOptions.to}`);
      return true;
    } catch (error) {
      console.error(`❌ SMTP send failed to ${mailOptions.to}:`, error.message);
      return false;
    }
  } else {
    console.warn(`⚠️ SMTP Transporter not initialized for ${mailOptions.to}`);
    return false;
  }
};

/**
 * Send OTP email to user
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

  if (process.env.NODE_ENV === "development") {
    console.log("\n========================================");
    console.log("📧 EMAIL OTP SERVICE (Log only)");
    console.log(`To: ${email} | OTP: ${otp}`);
    console.log("========================================\n");
  }

  const success = await sendEmailHelper(mailOptions);
  if (!success && process.env.NODE_ENV === "development") {
    console.log("ℹ️ Local development fallback: allowing OTP verification to continue (check console logs for OTP).");
    return true;
  }
  return success;
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
          <a href="${process.env.FRONTEND_URL || "https://lepondicheese.com"}/shop" 
             style="background: #2C5530; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Explore Our Collection
          </a>
        </div>
      </div>
    `,
  };

  await sendEmailHelper(mailOptions);
};

/**
 * Send order confirmation email to user & notify admin emails
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
    cc: ADMIN_EMAILS,
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

  await sendEmailHelper(mailOptions);
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
          <p><strong>Courier:</strong> ${order.courierPartner || "Standard Delivery"}</p>
          <p><strong>Tracking Number:</strong> <span style="font-size: 18px; font-weight: bold; color: #C9A961;">${order.trackingNumber || "N/A"}</span></p>
        </div>
      </div>
    `,
  };

  await sendEmailHelper(mailOptions);
};

/**
 * Send order delivered email to user
 */
const sendOrderDeliveredEmail = async (order, user) => {
  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Your order has been delivered! 🎉 - Order ${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2C5530; margin: 0;">Le Pondicherry Cheese</h1>
          <p style="color: #C9A961; font-weight: bold; margin: 5px 0; text-transform: uppercase; letter-spacing: 2px;">Order Delivered</p>
        </div>
        <div style="background: #FAF7F2; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2C5530; margin-top: 0;">Order #${order.orderId} Delivered!</h2>
          <p style="color: #444; font-size: 16px; line-height: 1.5;">Hi ${user.name || "Customer"}, your order has been successfully delivered. We hope you enjoy our handcrafted artisan cheeses!</p>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center; line-height: 1.5;">Thank you for choosing Le Pondicherry Cheese. If you have any feedback or questions, please feel free to reply to this email.</p>
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Le Pondicherry Cheese. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await sendEmailHelper(mailOptions);
};

/**
 * Send General Contact Form Enquiry Email to Admins
 */
const sendContactEnquiryAdminEmail = async (data) => {
  const referenceId = "GEN-" + Date.now();
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
    to: ADMIN_EMAILS,
    subject: `New General Enquiry | Le Cheese Pondicherry | ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2C5530; padding: 24px 32px;">
          <h2 style="color: #FAB519; margin: 0; font-size: 22px;">🧀 Le Pondicherry Cheese</h2>
          <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 14px;">New General Enquiry Received</p>
        </div>
        <div style="padding: 28px 32px; background-color: #FAF7F2;">
          <p style="color: #1A1A1A; font-size: 15px; margin-top: 0;">
            Hello Team,<br><br>
            A new enquiry has been submitted through the <b>Le Cheese Pondicherry Contact Form</b>.
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="background-color: #2C5530;">
              <td colspan="2" style="padding: 10px 16px; color: #FAB519; font-weight: bold; font-size: 13px; text-transform: uppercase;">ENQUIRY DETAILS</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; width: 38%; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Reference ID</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${referenceId}</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Submitted On</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${timestamp}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Name</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.name}</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email</td>
              <td style="padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${data.email}" style="color: #2C5530;">${data.email}</a></td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Mobile</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.mobile ? ((data.dialCode || "+91") + ' ' + data.mobile) : 'Not provided'}</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; white-space: pre-wrap;">${data.message}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };
  const success = await sendEmailHelper(mailOptions);
  return { success, referenceId };
};

/**
 * Send Wholesale Enquiry Email to Admins
 */
const sendWholesaleEnquiryAdminEmail = async (data) => {
  const referenceId = "WHL-" + Date.now();
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
    to: ADMIN_EMAILS,
    subject: `New Wholesale Enquiry | Le Cheese Pondicherry | ${data.businessName || data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2C5530; padding: 24px 32px;">
          <h2 style="color: #FAB519; margin: 0; font-size: 22px;">🧀 Le Pondicherry Cheese</h2>
          <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 14px;">New Wholesale / B2B Enquiry</p>
        </div>
        <div style="padding: 28px 32px; background-color: #FAF7F2;">
          <p style="color: #1A1A1A; font-size: 15px; margin-top: 0;">
            Hello Team,<br><br>
            A new wholesale inquiry has been submitted on the website.
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="background-color: #2C5530;">
              <td colspan="2" style="padding: 10px 16px; color: #FAB519; font-weight: bold; font-size: 13px; text-transform: uppercase;">WHOLESALE DETAILS</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; width: 38%; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Reference ID</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${referenceId}</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Business Name</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.businessName || data.name || "N/A"}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Contact Person</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.contactPerson || data.name || "N/A"}</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email</td>
              <td style="padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${data.email}" style="color: #2C5530;">${data.email}</a></td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Mobile / Phone</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.mobile ? ((data.dialCode || "+91") + ' ' + data.mobile) : (data.phone || 'Not provided')}</td>
            </tr>
            <tr style="background-color: #fafafa;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Business Type / Location</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.businessType || data.location || "N/A"}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; vertical-align: top;">Requirement / Message</td>
              <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; white-space: pre-wrap;">${data.message || data.requirement || "N/A"}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };
  const success = await sendEmailHelper(mailOptions);
  return { success, referenceId };
};

// Initialize on module load (skip during tests to avoid open handles)
if (process.env.NODE_ENV !== "test") {
  initializeTransporter().catch((err) =>
    console.error("❌ Email transporter initialization error:", err.message),
  );
}

module.exports = {
  ADMIN_EMAILS,
  sendOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendShippingUpdateEmail,
  sendOrderDeliveredEmail,
  sendContactEnquiryAdminEmail,
  sendWholesaleEnquiryAdminEmail,
  initializeTransporter,
};
