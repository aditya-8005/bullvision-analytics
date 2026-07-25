const {

    calculateCrashResistance

} = require(

    "../src/analytics/scoring/crashResistanceScore"

);

console.log(

    "========== Crash Resistance ==========\n"

);

const samples = [

    -5,

    -12,

    -18,

    -25,

    -35,

    -45,

    -55,

    -68

];

for (const drawdown of samples) {

    console.log(

        `Drawdown: ${drawdown}%`

    );

    console.log(

        calculateCrashResistance(

            drawdown

        )

    );

    console.log();

}

console.log(

    "======================================"

);