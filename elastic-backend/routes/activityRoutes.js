const express = require("express");
const router = express.Router();

const { getActivityRecommendations } = require("../controllers/ActivityRecommendationController.js");

router.get("/recommend", getActivityRecommendations);

module.exports = router;
