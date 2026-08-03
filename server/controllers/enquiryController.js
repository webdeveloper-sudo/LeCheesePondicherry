const {
  sendContactEnquiryAdminEmail,
  sendWholesaleEnquiryAdminEmail,
} = require("../utils/emailService");

/**
 * @desc    Handle General Contact Form Submission
 * @route   POST /api/enquiries/contact
 * @access  Public
 */
const handleContactEnquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, or message",
      });
    }

    const result = await sendContactEnquiryAdminEmail(req.body);

    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
      referenceId: result.referenceId,
    });
  } catch (error) {
    console.error("Error submitting contact enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry. Please try again.",
    });
  }
};

/**
 * @desc    Handle Wholesale Form Submission
 * @route   POST /api/enquiries/wholesale
 * @access  Public
 */
const handleWholesaleEnquiry = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: email",
      });
    }

    const result = await sendWholesaleEnquiryAdminEmail(req.body);

    return res.status(200).json({
      success: true,
      message: "Wholesale enquiry submitted successfully",
      referenceId: result.referenceId,
    });
  } catch (error) {
    console.error("Error submitting wholesale enquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit wholesale enquiry. Please try again.",
    });
  }
};

module.exports = {
  handleContactEnquiry,
  handleWholesaleEnquiry,
};
