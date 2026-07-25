const {

    calculateMean,

    calculateVariance,

    calculateStandardDeviation

} = require("../src/analytics/utils/statistics");

const numbers = [

    10,

    20,

    30,

    40,

    50

];

console.log("========== Statistics ==========\n");

console.log("Mean:");

console.log(calculateMean(numbers));

console.log("\nVariance:");

console.log(calculateVariance(numbers));

console.log("\nStandard Deviation:");

console.log(calculateStandardDeviation(numbers));

console.log("\n===============================");