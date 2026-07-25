const {

    clampScore,

    getGrade,

    getInterpretation

} = require("../utils/scoringUtils");

/**
 * Calculates Stability Score.
 *
 * Lower volatility
 * =
 * Higher score.
 *
 * @param {number} volatility
 * @returns {Object}
 */
function calculateStabilityScore(volatility) {

    if (typeof volatility !== "number") {

        throw new Error(
            "Volatility must be a number."
        );

    }

    /**
     * Expected volatility range
     * 0.00
     * to
     * 0.10
     */

    const {

    MAX_EXPECTED_VOLATILITY

} = require("../constants/scoringConfig");

    const rawScore =

        100 -

        (

            volatility /

            MAX_EXPECTED_VOLATILITY

        ) * 100;

    const score =

        clampScore(rawScore);

    return {

        score: Number(score.toFixed(2)),

        grade: getGrade(score),

        interpretation:

            getInterpretation(

                "Stability",

                score

            )

    };

}

module.exports = {

    calculateStabilityScore

};