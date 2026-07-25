const {

    RESILIENCE_WEIGHTS

} = require(

    "../constants/scoringConfig"

);

/**
 * Calculates BullVision Resilience Score.
 */

function calculateResilienceScore({

    crashResistance,

    recoveryAbility,

    marketStrength,

    stability

}) {

    const score =

        (

            crashResistance.score

            *

            RESILIENCE_WEIGHTS.crashResistance

        )

        +

        (

            recoveryAbility.score

            *

            RESILIENCE_WEIGHTS.recoveryAbility

        )

        +

        (

            marketStrength.score

            *

            RESILIENCE_WEIGHTS.marketStrength

        )

        +

        (

            stability.score

            *

            RESILIENCE_WEIGHTS.stability

        );

    return {

        score:

            Number(

                score.toFixed(2)

            ),

        breakdown: {

            crashResistance,

            recoveryAbility,

            marketStrength,

            stability

        }

    };

}

module.exports = {

    calculateResilienceScore

};