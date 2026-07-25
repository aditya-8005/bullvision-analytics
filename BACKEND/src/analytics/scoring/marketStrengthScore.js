const {

    clampScore,

    getGrade,

    getInterpretation

} = require("../utils/scoringUtils");

/**
 * Calculates Market Strength Score.
 *
 * Positive relative performance
 * =
 * Better.
 *
 */

function calculateMarketStrengthScore(

    relativePerformance

) {

    if (

        typeof relativePerformance !== "number"

    ) {

        throw new Error(

            "Relative performance must be numeric."

        );

    }

    /**
     * Assume

     +20%

     is excellent

     -20%

     is terrible

     */

    const normalized =

        (

            (

                relativePerformance + 20

            )

            /

            40

        )

        *

        100;

    const score =

        clampScore(

            normalized

        );

    return {

        score: Number(

            score.toFixed(2)

        ),

        grade:

            getGrade(score),

        interpretation:

            getInterpretation(

                "Market Strength",

                score

            )

    };

}

module.exports = {

    calculateMarketStrengthScore

};