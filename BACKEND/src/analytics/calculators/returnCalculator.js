const { validateHistory } = require("../utils/historyValidator");

function calculateReturn(history) {

    validateHistory(history, 2);

    const startPrice = history[0].close;
    const endPrice = history[history.length - 1].close;

    const absoluteReturn = endPrice - startPrice;

    const percentageReturn =
        (absoluteReturn / startPrice) * 100;

    return {
        startPrice,
        endPrice,
        absoluteReturn: Number(absoluteReturn.toFixed(2)),
        percentageReturn: Number(percentageReturn.toFixed(2))
    };
}

module.exports = {
    calculateReturn
};