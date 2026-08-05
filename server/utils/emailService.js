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
/**
 * Send order confirmation email to user & notify admin emails
 */
const sendOrderConfirmationEmail = async (order, user) => {
  const address = order.deliveryAddress || {};
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
        <div style="font-weight: bold; color: #1A1A1A; font-size: 14px;">${item.productName}</div>
        ${item.weight ? `<div style="font-size: 12px; color: #777;">Weight: ${item.weight}</div>` : ""}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center; font-size: 14px; color: #444;">
        ₹${item.price} × ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: bold; color: #1A1A1A; font-size: 14px;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `,
    )
    .join("");

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const fullAddressStr = [
    address.addressLine1,
    address.addressLine2,
    address.landmark ? `Landmark: ${address.landmark}` : "",
    `${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`,
    address.country || "India"
  ].filter(Boolean).join("<br/>");

  const mailOptions = {
    from:
      process.env.SMTP_FROM ||
      `"Le Pondicherry Cheese" <${process.env.SMTP_USER}>`,
    to: user.email,
    cc: ADMIN_EMAILS,
    subject: `Order Confirmed: ${order.orderId} - Le Pondicherry Cheese`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background-color: #2C5530; padding: 25px 30px; text-align: center;">
          <h1 style="color: #FAB519; margin: 0; font-size: 24px; letter-spacing: 1px;">🧀 Le Pondicherry Cheese</h1>
          <p style="color: #ffffff; margin: 6px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">Order Confirmation</p>
        </div>

        <div style="padding: 30px; background-color: #FAF7F2;">
          
          <p style="color: #1A1A1A; font-size: 16px; margin-top: 0;">
            Hi <strong>${address.name || user.name || "Customer"}</strong>,
          </p>
          <p style="color: #555; font-size: 14px; line-height: 1.5;">
            Thank you for shopping with us! We have received your payment and your artisan cheese order has been confirmed.
          </p>

          <!-- Order Overview Box -->
          <div style="background-color: #ffffff; border: 1px solid #e5e0d8; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 4px 0; color: #777;">Order ID:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #2C5530;">#${order.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #777;">Placed On:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #1A1A1A;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #777;">Payment Mode:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #1A1A1A; text-transform: uppercase;">${order.paymentMode || "Online"}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #777;">Payment Status:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #2C5530; text-transform: uppercase;">${order.paymentStatus || "Completed"}</td>
              </tr>
              ${order.transactionId ? `
              <tr>
                <td style="padding: 4px 0; color: #777;">Transaction ID:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #555;">${order.transactionId}</td>
              </tr>` : ""}
            </table>
          </div>

          <!-- Address & Customer Details -->
          <div style="background-color: #ffffff; border: 1px solid #e5e0d8; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
            <div style="color: #2C5530; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              📍 Delivery Address ${address.type ? `(${address.type.toUpperCase()})` : ""}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #1A1A1A;">${address.name || user.name || "Customer"}</div>
            <div style="font-size: 13px; color: #555; line-height: 1.5; margin-top: 4px;">
              ${fullAddressStr}
            </div>
            <div style="font-size: 13px; color: #2C5530; font-weight: bold; margin-top: 8px;">
              📞 Mobile: ${address.mobile || user.mobile || "N/A"}
            </div>
          </div>

          <!-- Items Ordered Table -->
          <div style="background-color: #ffffff; border: 1px solid #e5e0d8; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
            <div style="background-color: #2C5530; color: #FAB519; padding: 12px 18px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              📦 Items Ordered
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #fcfcfc; border-bottom: 1px solid #eee; text-align: left; font-size: 12px; color: #777;">
                  <th style="padding: 10px 12px;">Item</th>
                  <th style="padding: 10px 12px; text-align: center;">Qty & Unit</th>
                  <th style="padding: 10px 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Financial Breakdown -->
          <div style="background-color: #ffffff; border: 1px solid #e5e0d8; border-radius: 10px; padding: 18px;">
            <div style="color: #2C5530; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
              💳 Bill Details Breakdown
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #444;">
              <tr>
                <td style="padding: 5px 0;">Basket Subtotal:</td>
                <td style="padding: 5px 0; text-align: right;">₹${Number(order.orderAmount || 0).toLocaleString("en-IN")}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="padding: 5px 0; color: #d32f2f;">Discounts & Offers:</td>
                <td style="padding: 5px 0; text-align: right; color: #d32f2f;">-₹${Number(order.discount).toLocaleString("en-IN")}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 5px 0;">Delivery Charge:</td>
                <td style="padding: 5px 0; text-align: right;">₹${Number(order.deliveryCharge || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">GST / Tax (4%):</td>
                <td style="padding: 5px 0; text-align: right;">₹${Number(order.taxAmount || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr style="border-top: 2px solid #2C5530; font-size: 16px; font-weight: bold;">
                <td style="padding: 12px 0 4px 0; color: #2C5530;">Total Paid:</td>
                <td style="padding: 12px 0 4px 0; text-align: right; color: #2C5530;">₹${Number(order.finalAmount || 0).toLocaleString("en-IN")}</td>
              </tr>
            </table>
          </div>

        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #eee; padding: 20px; text-align: center; color: #888; font-size: 12px; background-color: #ffffff;">
          <p style="margin: 0 0 6px 0;">Thank you for choosing Le Pondicherry Cheese.</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} Le Pondicherry Cheese. All rights reserved.</p>
        </div>

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
