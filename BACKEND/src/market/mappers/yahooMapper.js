function mapYahooCandle(candle) {
    if (!candle || !candle.date || candle.close == null || !Number.isFinite(candle.close)) {
        return null;
    }

    return {
        date: candle.date.toISOString().split("T")[0],
        open: Number.isFinite(candle.open) ? candle.open : null,
        high: Number.isFinite(candle.high) ? candle.high : null,
        low: Number.isFinite(candle.low) ? candle.low : null,
        close: candle.close,
        volume: Number.isFinite(candle.volume) ? candle.volume : null,
    };
}

function mapYahooHistory(history) {
    if (!Array.isArray(history)) {
        return [];
    }
    return history.map(mapYahooCandle).filter(Boolean);
}

module.exports = {
    mapYahooCandle,
    mapYahooHistory
};