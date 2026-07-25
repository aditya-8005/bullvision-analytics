const {

    calculateStabilityScore

} = require(

    "../src/analytics/scoring/stabilityScore"

);

console.log(
    "========== Stability Score ==========\n"
);

const samples = [

    0.01,

    0.02,

    0.03,

    0.05,

    0.07,

    0.09,

    0.11

];

for (const volatility of samples) {

    console.log(

        `Volatility : ${volatility}`

    );

    console.log(

        calculateStabilityScore(

            volatility

        )

    );

    console.log();

}

console.log(
    "====================================="
);