const express = require("express");

const router = express.Router();

const {
    getEventAnalysis,
    getAllEventAnalytics,
} = require("../controllers/eventAnalysisController");

router.get(
    "/:symbol/all",
    getAllEventAnalytics
);

router.get(
    "/:symbol/:eventId",
    getEventAnalysis
);

module.exports = router;