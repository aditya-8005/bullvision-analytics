const {

    calculateResilienceScore

} = require(

    "../src/analytics/scoring/resilienceScore"

);

const result =

calculateResilienceScore({

    crashResistance: {

        score: 82

    },

    recoveryAbility: {

        score: 76

    },

    marketStrength: {

        score: 91

    },

    stability: {

        score: 80

    }

});

console.log(

    "========== Resilience ==========\n"

);

console.log(

    JSON.stringify(

        result,

        null,

        4

    )

);

console.log(

    "\n==============================="

);