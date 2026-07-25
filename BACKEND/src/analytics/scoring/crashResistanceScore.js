const {
    clampScore,
    getGrade,
    getInterpretation,
} = require("../utils/scoringUtils");

const {
    MAX_EXPECTED_DRAWDOWN,
} = require("../constants/scoringConfig");

function calculateCrashResistance(drawdownPercentage) {

    if (typeof drawdownPercentage !== "number") {
        throw new Error(
            "Drawdown percentage must be a number."
        );
    }

    const rawScore =
        100 -
        (
            Math.abs(drawdownPercentage) /
            MAX_EXPECTED_DRAWDOWN
        ) * 100;

    const score = clampScore(rawScore);

    return {
        score: Number(score.toFixed(2)),
        grade: getGrade(score),
        interpretation: getInterpretation(
            "Crash Resistance",
            score
        ),
    };
}

module.exports = {
    calculateCrashResistance,
};