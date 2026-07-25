const { getHistoryBetween } = require("../src/market/services/marketService");
const { calculateReturn } = require("../src/analytics/calculators/returnCalculator");

async function main() {

    const history = await getHistoryBetween(
        "HDFCBANK_NS",
        "2020-02-20",
        "2020-03-31"
    );

    const result = calculateReturn(history);

    console.log(result);
}

main();