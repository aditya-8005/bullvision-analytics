/**
 * Validates the stock symbol query parameter.
 */
const validateQuoteRequest = (req, res, next) => {

    const { symbol } = req.query;

    if (!symbol) {
        return res.status(400).json({
            success: false,
            message: "Stock symbol is required.",
        });
    }

    if (typeof symbol !== "string") {
        return res.status(400).json({
            success: false,
            message: "Stock symbol must be a string.",
        });
    }

    const trimmedSymbol = symbol.trim();

    if (trimmedSymbol.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Stock symbol cannot be empty.",
        });
    }

    if (trimmedSymbol.length > 30) {
        return res.status(400).json({
            success: false,
            message: "Invalid stock symbol.",
        });
    }

    if (!/^[A-Za-z0-9&-]+$/.test(trimmedSymbol)) {
        return res.status(400).json({
            success: false,
            message: "Invalid stock symbol format.",
        });
    }

    req.query.symbol = trimmedSymbol.toUpperCase();

    next();
};

module.exports = {
    validateQuoteRequest,
};