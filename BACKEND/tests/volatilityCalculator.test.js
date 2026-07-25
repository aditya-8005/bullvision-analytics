const {
    calculateVolatility,
} = require("../src/analytics/calculators/volatilityCalculator");

const history = [

    { date: "2024-01-01", close: 100 },

    { date: "2024-01-02", close: 102 },

    { date: "2024-01-03", close: 101 },

    { date: "2024-01-04", close: 104 },

    { date: "2024-01-05", close: 103 },

];

const result = calculateVolatility(history);

console.log("========== Volatility Analysis ==========\n");

console.log(JSON.stringify(result, null, 4));

console.log("\n=========================================");