const {

    calculateMarketStrengthScore

} = require(

    "../src/analytics/scoring/marketStrengthScore"

);

console.log(

    "========== Market Strength ==========\n"

);

const values = [

    -20,

    -10,

    -5,

    0,

    5,

    10,

    20

];

for (

    const value

    of

    values

) {

    console.log(

        value

    );

    console.log(

        calculateMarketStrengthScore(

            value

        )

    );

    console.log();

}

console.log(

    "====================================="

);