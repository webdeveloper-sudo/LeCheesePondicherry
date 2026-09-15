const express = require("express");
const router = express.Router();
const {
  handleContactEnquiry,
  handleWholesaleEnquiry,
  handleOfferLead,
} = require("../controllers/enquiryController");

router.post("/contact", handleContactEnquiry);
router.post("/wholesale", handleWholesaleEnquiry);
router.post("/offer-lead", handleOfferLead);

module.exports = router;
