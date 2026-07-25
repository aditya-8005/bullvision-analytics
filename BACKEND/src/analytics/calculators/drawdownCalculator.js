const { validateHistory } = require("../utils/historyValidator");

function calculateDrawdown(history) {

    validateHistory(history, 1);

    // Handle single candle
    if (history.length === 1) {
        return {
            peak: {
                price: history[0].close,
                date: history[0].date,
                index: 0,
            },
            bottom: {
                price: history[0].close,
                date: history[0].date,
                index: 0,
            },
            drawdownPercentage: 0,
        };
    }

    // Highest closing price encountered so far
    let currentPeakPrice = history[0].close;
    let currentPeakDate = history[0].date;
    let currentPeakIndex = 0;

    // Worst drawdown found so far
    let maxDrawdown = 0;

    let drawdownPeakPrice = currentPeakPrice;
    let drawdownPeakDate = currentPeakDate;
    let drawdownPeakIndex = currentPeakIndex;

    let drawdownBottomPrice = currentPeakPrice;
    let drawdownBottomDate = currentPeakDate;
    let drawdownBottomIndex = currentPeakIndex;

    for (let i = 1; i < history.length; i++) {

        const candle = history[i];

        // Found a new peak
        if (candle.close > currentPeakPrice) {

            currentPeakPrice = candle.close;
            currentPeakDate = candle.date;
            currentPeakIndex = i;

        }

        const currentDrawdown =
            ((candle.close - currentPeakPrice) / currentPeakPrice) * 100;

        // Found a worse drawdown
        if (currentDrawdown < maxDrawdown) {

            maxDrawdown = currentDrawdown;

            drawdownPeakPrice = currentPeakPrice;
            drawdownPeakDate = currentPeakDate;
            drawdownPeakIndex = currentPeakIndex;

            drawdownBottomPrice = candle.close;
            drawdownBottomDate = candle.date;
            drawdownBottomIndex = i;

        }

    }

    return {

        peak: {
            price: drawdownPeakPrice,
            date: drawdownPeakDate,
            index: drawdownPeakIndex,
        },

        bottom: {
            price: drawdownBottomPrice,
            date: drawdownBottomDate,
            index: drawdownBottomIndex,
        },

        drawdownPercentage: Number(maxDrawdown.toFixed(2)),

    };

}

module.exports = {
    calculateDrawdown,
};