const { validateHistory } = require("../utils/historyValidator");

function calculateVolatility(history) {

    validateHistory(
        history,
        2,
        ["date", "close"]
    );

    const dailyReturns = [];

    for (let i = 1; i < history.length; i++) {

        const previousClose = history[i - 1].close;
        const currentClose = history[i].close;

        const dailyReturn =
            ((currentClose - previousClose) / previousClose) * 100;

        dailyReturns.push(dailyReturn);

    }

    const averageDailyReturn =
        dailyReturns.reduce((sum, value) => sum + value, 0) /
        dailyReturns.length;

    const variance =
        dailyReturns.reduce((sum, value) => {

            return sum + Math.pow(value - averageDailyReturn, 2);

        }, 0) / dailyReturns.length;

    const volatility = Math.sqrt(variance);

    return {

        averageDailyReturn: Number(
            averageDailyReturn.toFixed(2)
        ),

        volatility: Number(
            volatility.toFixed(2)
        ),

        observations: dailyReturns.length

    };

}

module.exports = {
    calculateVolatility,
};