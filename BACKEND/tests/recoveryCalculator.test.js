const {
    calculateDrawdown,
} = require("../src/analytics/calculators/drawdownCalculator");

const {
    calculateRecovery,
} = require("../src/analytics/calculators/recoveryCalculator");

const history = [

    { date: "2024-01-01", close: 100 },
    { date: "2024-01-02", close: 120 },
    { date: "2024-01-03", close: 150 },
    { date: "2024-01-04", close: 130 },
    { date: "2024-01-05", close: 90 },
    { date: "2024-01-06", close: 95 },
    { date: "2024-01-07", close: 110 },
    { date: "2024-01-08", close: 130 },
    { date: "2024-01-09", close: 145 },
    { date: "2024-01-10", close: 151 }

];

const drawdown = calculateDrawdown(history);

const recovery = calculateRecovery(
    history,
    drawdown
);

console.log("========== Recovery Analysis ==========\n");

console.log(JSON.stringify(recovery, null, 4));

console.log("\n=======================================");