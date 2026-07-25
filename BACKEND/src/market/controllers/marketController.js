const quoteService = require("../services/quoteService");
const { searchInstruments } = require("../services/instrumentService");

const {
    getHistory,
    getHistoryBetween,
    getPriceOnDate,
} = require("../services/marketService");


const getHistoricalData = async (req, res, next) => {

    try {

        const { symbol, from, to, range } = req.query;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: "Symbol is required.",
            });
        }

        let fromDate = from;
        let toDate = to;

        if (range) {
            toDate = new Date().toISOString().slice(0, 10);
            const d = new Date();
            if (range === '1D') d.setDate(d.getDate() - 1);
            else if (range === '5D') d.setDate(d.getDate() - 5);
            else if (range === '1M') d.setMonth(d.getMonth() - 1);
            else if (range === '3M') d.setMonth(d.getMonth() - 3);
            else if (range === '6M') d.setMonth(d.getMonth() - 6);
            else if (range === '1Y') d.setFullYear(d.getFullYear() - 1);
            else if (range === '2Y') d.setFullYear(d.getFullYear() - 2);
            else if (range === '5Y') d.setFullYear(d.getFullYear() - 5);
            else if (range === 'MAX') d.setFullYear(d.getFullYear() - 20);
            fromDate = d.toISOString().slice(0, 10);
        }

        const data =
            fromDate && toDate
                ? await getHistoryBetween(
                      symbol,
                      fromDate,
                      toDate
                  )
                : await getHistory(symbol);

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });

    } catch (error) {

        next(error);

    }

};

const getHistoricalPrice = async (req, res, next) => {

    try {

        const { symbol, date } = req.query;

        if (!symbol || !date) {

            return res.status(400).json({
                success: false,
                message:
                    "Symbol and date are required.",
            });

        }

        const candle =
            await getPriceOnDate(symbol, date);

        if (!candle) {

            return res.status(404).json({
                success: false,
                message: "Price not found.",
            });

        }

        return res.status(200).json({
            success: true,
            data: candle,
        });

    } catch (error) {

        next(error);

    }

};

const searchStocks = (req, res) => {
    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required.",
            });
        }

        const results = searchInstruments(q);

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getStockQuote = async (req, res, next) => {
    try {

        const quote = await quoteService.fetchStockQuote(
            req.query.symbol
        );

        return res.status(200).json({
            success: true,
            data: quote,
        });

    } catch (error) {

        next(error);

    }
};
module.exports = {
    searchStocks,
    getStockQuote,
    getHistoricalData,
    getHistoricalPrice,
};