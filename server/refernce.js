// Function to send email
const sendEmail = async (to, subject, html) => {
  try {
    // Check if SMTP credentials exist
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.warn("⚠️ SMTP credentials missing. Email not sent.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"Achariya Portal" <no-reply@achariya.org>',
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// 2. Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { admissionNo, contactType } = req.body; // contactType: 'mobile' or 'email'

    if (!admissionNo || !contactType) {
      return res
        .status(400)
        .json({ message: "Admission number and contact type are required" });
    }

    const student = await Student.findOne({ admissionNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP
    await Otp.deleteMany({ admissionNo });

    const newOtp = new Otp({
      admissionNo,
      otp,
      contactType,
    });
    await newOtp.save();

    let message = `OTP generated.`;

    if (contactType === "email") {
      if (student.email) {
        const sent = await sendEmail(
          student.email,
          "Your Achariya Portal OTP",
          `<p>Your OTP for verification is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>`
        );
        if (sent) {
          message = `OTP sent successfully to your registered email ending in **${student.email.slice(
            -4
          )}.`;
        } else {
          // Fallback if email fails (likely due to missing config in this env)
          console.warn(
            "Email sending failed or skipped. OTP is still generated."
          );
          message = "Failed to send email. Check server logs.";
        }
      } else {
        return res
          .status(400)
          .json({ message: "No email address found for this student." });
      }
    } else if (contactType === "mobile") {
      if (student.mobileNo) {
        const sent = await sendSms(
          student.mobileNo,
          `Your Achariya Portal OTP is: ${otp}. Valid for 10 minutes.`
        );

        if (sent) {
          message = `OTP sent successfully to your mobile number ending in **${student.mobileNo.slice(
            -4
          )}.`;
        } else {
          // Fallback for demo/dev if no Twilio (keep user moving)
          // console.warn("Twilio failed/missing. OTP generated internally.");
          // message = "SMS service unavailable. Please check server logs.";

          // CRITICAL: If SMS fails in production, user sees error.
          // But since user "PREFERS TOO MUCH", I will assume they might config it.
          // If not, I return the message indicating failure but do NOT show OTP (secure).
          message = "Failed to send SMS. Please contact admin or try Email.";
        }
      } else {
        return res
          .status(400)
          .json({ message: "No mobile number found for this student." });
      }
    }

    res.json({
      message: message,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// 3. Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { admissionNo, otp } = req.body;

    if (!admissionNo || !otp) {
      return res
        .status(400)
        .json({ message: "Admission number and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ admissionNo, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP valid
    // Delete OTP record after successful use
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
