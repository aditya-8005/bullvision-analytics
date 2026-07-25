const { validateHistory } = require("../utils/historyValidator");
const { calculateReturn } = require("./returnCalculator");

function calculateRelativePerformance(historyA, historyB) {

    validateHistory(
        historyA,
        2,
        ["date", "close"]
    );

    validateHistory(
        historyB,
        2,
        ["date", "close"]
    );

    const assetA = calculateReturn(historyA);
    const assetB = calculateReturn(historyB);

    const difference =
        assetA.percentageReturn -
        assetB.percentageReturn;

    return {

        assetAReturn: assetA.percentageReturn,

        assetBReturn: assetB.percentageReturn,

        relativePerformance: Number(
            difference.toFixed(2)
        ),

        outperformer:
            difference > 0
                ? "A"
                : difference < 0
                ? "B"
                : "Equal"

    };

}

module.exports = {
    calculateRelativePerformance,
};