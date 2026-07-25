const {
    calculateRelativePerformance,
} = require("../src/analytics/calculators/relativePerformanceCalculator");

const hdfc = [

    { date: "1", close: 100 },

    { date: "2", close: 90 },

    { date: "3", close: 95 }

];

const icici = [

    { date: "1", close: 100 },

    { date: "2", close: 80 },

    { date: "3", close: 85 }

];

const result = calculateRelativePerformance(
    hdfc,
    icici
);

console.log(
    JSON.stringify(result, null, 4)
);