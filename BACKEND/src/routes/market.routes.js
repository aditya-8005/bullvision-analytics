const express = require("express");

const marketController = require("../market/controllers/marketController");

const router = express.Router();

/**
 * GET /market/search?q=RELIANCE
 */
router.get("/search", marketController.searchStocks);

/**
 * GET /market/quote?symbol=RELIANCE
 */
const {
    validateQuoteRequest,
} = require("../market/validators/quoteValidator");

router.get(
    "/quote",
    validateQuoteRequest,
    marketController.getStockQuote
);

router.get(
    "/history",
    marketController.getHistoricalData
);

router.get(
    "/price",
    marketController.getHistoricalPrice
);

module.exports = router;