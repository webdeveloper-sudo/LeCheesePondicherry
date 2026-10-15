const express = require("express");
const router = express.Router();
const {
  submitChallengeEntry,
  getLeaderboard,
  syncViews,
  deleteAllContestants,
  recalcAllViews,
} = require("../controllers/challengeController");

router.post("/entry", submitChallengeEntry);
router.get("/leaderboard", getLeaderboard);
router.post("/sync-views", syncViews);

// New admin routes for data cleanup and view recalculation
router.delete("/contestants", deleteAllContestants);
router.post("/recalc-views", recalcAllViews);

module.exports = router;
