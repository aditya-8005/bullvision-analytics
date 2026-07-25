const { validateHistory } = require("../utils/historyValidator");

function calculateStatistics(history) {

    validateHistory(history);

    const highs = history.map(candle => candle.high);
    const lows = history.map(candle => candle.low);
    const closes = history.map(candle => candle.close);
    const volumes = history.map(candle => candle.volume);

    const highestPrice = Math.max(...highs);
    const lowestPrice = Math.min(...lows);

    const totalVolume = volumes.reduce(
        (sum, volume) => sum + volume,
        0
    );

    const averageClose =
        closes.reduce((sum, close) => sum + close, 0) /
        closes.length;

    return {
        tradingDays: history.length,
        highestPrice,
        lowestPrice,
        averageClose: Number(averageClose.toFixed(2)),
        totalVolume
    };
}

module.exports = {
    calculateStatistics
};