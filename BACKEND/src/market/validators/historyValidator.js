function validateCandle(candle) {
    if (!candle.date) {
        throw new Error("Missing date");
    }

    const fields = ["open", "high", "low", "close", "volume"];

    for (const field of fields) {
        if (candle[field] === undefined || candle[field] === null) {
            throw new Error(`Missing ${field} on ${candle.date}`);
        }
    }

    if (candle.high < candle.open)
        throw new Error(`High < Open on ${candle.date}`);

    if (candle.high < candle.close)
        throw new Error(`High < Close on ${candle.date}`);

    if (candle.low > candle.open)
        throw new Error(`Low > Open on ${candle.date}`);

    if (candle.low > candle.close)
        throw new Error(`Low > Close on ${candle.date}`);

    return true;
}

function validateHistory(history) {
    const seenDates = new Set();

    for (const candle of history) {

        validateCandle(candle);

        if (seenDates.has(candle.date)) {
            throw new Error(`Duplicate date ${candle.date}`);
        }

        seenDates.add(candle.date);
    }

    return true;
}

module.exports = {
    validateCandle,
    validateHistory
};