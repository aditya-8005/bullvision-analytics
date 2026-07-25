const { getHistoryBetween } = require("../src/market/services/marketService");

const {
    calculateStatistics
} = require("../src/analytics/calculators/statisticsCalculator");

async function main() {

    const history = await getHistoryBetween(
        "HDFCBANK_NS",
        "2020-02-20",
        "2020-03-31"
    );

    const statistics = calculateStatistics(history);

    console.log(statistics);
}

main();