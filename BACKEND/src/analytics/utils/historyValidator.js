function validateHistory(history, minimumCandles = 1, requiredFields = []) {

    if (!Array.isArray(history)) {
        throw new Error("History must be an array.");
    }

    if (history.length < minimumCandles) {
        throw new Error(
            `History must contain at least ${minimumCandles} candle(s).`
        );
    }

    history.forEach((candle, index) => {

        requiredFields.forEach(field => {

            if (candle[field] === undefined || candle[field] === null) {
                throw new Error(
                    `Missing '${field}' in candle at index ${index}.`
                );
            }

        });

    });

}

module.exports = {
    validateHistory,
};