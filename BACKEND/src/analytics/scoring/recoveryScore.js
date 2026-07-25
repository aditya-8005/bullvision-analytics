const {
    clampScore,
    getGrade,
    getInterpretation
} = require("../utils/scoringUtils");

/**
 * Calculates Recovery Ability Score.
 *
 * Lower recovery days
 * =
 * Better score.
 *
 * @param {number|null} recoveryDays
 * @param {boolean} recovered
 * @returns {Object}
 */
function calculateRecoveryScore(recoveryDays, recovered) {

    if (!recovered) {

        return {

            score: 0,

            grade: "F",

            interpretation: "Recovery Not Achieved"

        };

    }

    if (typeof recoveryDays !== "number") {

        throw new Error(
            "Recovery days must be a number."
        );

    }

    const {

    MAX_EXPECTED_RECOVERY_DAYS

} = require("../constants/scoringConfig");

    const rawScore =

        100 -

        (

            recoveryDays /

            MAX_EXPECTED_RECOVERY_DAYS

        ) * 100;

    const score = clampScore(rawScore);

    return {

        score: Number(score.toFixed(2)),

        grade: getGrade(score),

        interpretation: getInterpretation(
            "Recovery Ability",
            score
        )

    };

}

module.exports = {

    calculateRecoveryScore

};