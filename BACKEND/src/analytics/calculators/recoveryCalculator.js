const { validateHistory } = require("../utils/historyValidator");

function calculateRecovery(history, drawdown) {

    validateHistory(
        history,
        1,
        ["date", "close"]
    );

    if (!drawdown || !drawdown.peak || !drawdown.bottom) {
        throw new Error("Valid drawdown analysis is required.");
    }

    const targetPrice = drawdown.peak.price;
    const startIndex = drawdown.bottom.index;

    for (let i = startIndex + 1; i < history.length; i++) {

        if (history[i].close >= targetPrice) {

            return {

                recovered: true,

                recoveryPrice: history[i].close,

                recoveryDate: history[i].date,

                recoveryIndex: i,

                recoveryDays: i - startIndex

            };

        }

    }

    return {

        recovered: false,

        recoveryPrice: null,

        recoveryDate: null,

        recoveryIndex: null,

        recoveryDays: null

    };

}

module.exports = {
    calculateRecovery,
};