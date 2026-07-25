const YahooFinance = require("yahoo-finance2").default;
const { mapYahooHistory } = require("../mappers/yahooMapper");

const yahooFinance = new YahooFinance({
    suppressNotices: ["ripHistorical"],
});

async function getHistoricalData(symbol, fromDate, toDate) {
    try {
        const result = await yahooFinance.chart(symbol, {
            period1: fromDate,
            period2: toDate,
            interval: "1d",
        });

        return mapYahooHistory(result.quotes ?? []);

    } catch (error) {

        const message = (error.message || "").toLowerCase();

        const noDataErrors = [
            "no data found",
            "data doesn't exist",
            "data does not exist",
            "may be delisted",
            "not found",
            "no results",
            "no price data",
            "no historical data",
        ];

        const isNoDataError = noDataErrors.some(text =>
            message.includes(text)
        );

        if (isNoDataError) {

            console.warn(
                `📭 No historical data available for ${symbol} (${fromDate} → ${toDate})`
            );

            return [];
        }

        console.error(
            `❌ Yahoo Finance error for ${symbol}:`,
            error.message
        );

        throw error;
    }
}

async function getCompanyProfile(symbol) {
    try {
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: ["summaryProfile", "summaryDetail", "price"],
        });

        return {
            sector: result.summaryProfile?.sector || "—",
            industry: result.summaryProfile?.industry || "—",
            description:
                result.summaryProfile?.longBusinessSummary || "—",
            marketCap:
                result.summaryDetail?.marketCap ||
                result.price?.marketCap ||
                null,
            dividendYield:
                result.summaryDetail?.dividendYield || null,
            peRatio:
                result.summaryDetail?.trailingPE ||
                result.summaryDetail?.forwardPE ||
                null,
        };

    } catch (error) {

        console.error(
            `❌ Failed to fetch profile for ${symbol}:`,
            error.message
        );

        return null;
    }
}

module.exports = {
    getHistoricalData,
    getCompanyProfile,
};