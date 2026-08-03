const express = require("express");
const router = express.Router();
const {
  handleContactEnquiry,
  handleWholesaleEnquiry,
} = require("../controllers/enquiryController");

router.post("/contact", handleContactEnquiry);
router.post("/wholesale", handleWholesaleEnquiry);

module.exports = router;
