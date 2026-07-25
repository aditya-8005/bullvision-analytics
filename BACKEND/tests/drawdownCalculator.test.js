const {
    calculateDrawdown,
} = require("../src/analytics/calculators/drawdownCalculator");

const history = [

    { date: "2024-01-01", close: 100 },

    { date: "2024-01-02", close: 120 },

    { date: "2024-01-03", close: 150 },

    { date: "2024-01-04", close: 130 },

    { date: "2024-01-05", close: 90 },

    { date: "2024-01-06", close: 95 },

    { date: "2024-01-07", close: 110 },

    { date: "2024-01-08", close: 151 }

];

const result = calculateDrawdown(history);

console.log("========== Drawdown Analysis ==========\n");

console.log(JSON.stringify(result, null, 4));

console.log("\n=======================================");