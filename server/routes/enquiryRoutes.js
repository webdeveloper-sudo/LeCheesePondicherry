const express = require("express");
const router = express.Router();
const {
  handleContactEnquiry,
  handleWholesaleEnquiry,
  handleOfferLead,
  handleChallengeEntry,
} = require("../controllers/enquiryController");

router.post("/contact", handleContactEnquiry);
router.post("/wholesale", handleWholesaleEnquiry);
router.post("/offer-lead", handleOfferLead);
router.post("/challenge-entry", handleChallengeEntry);

module.exports = router;
