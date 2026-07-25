/**
 * Restricts a score to the range [0,100].
 *
 * @param {number} score
 * @returns {number}
 */
function clampScore(score) {

    return Math.max(
        0,
        Math.min(100, score)
    );

}

/**
 * Returns a grade for a normalized score.
 *
 * @param {number} score
 * @returns {string}
 */
function getGrade(score) {

    if (score >= 90) return "A+";

    if (score >= 80) return "A";

    if (score >= 70) return "B";

    if (score >= 60) return "C";

    if (score >= 40) return "D";

    return "F";

}

/**
 * Returns interpretation text.
 *
 * @param {string} metric
 * @param {number} score
 * @returns {string}
 */
function getInterpretation(metric, score) {

    const levels = {

        excellent: "Excellent",

        strong: "Strong",

        good: "Good",

        moderate: "Moderate",

        weak: "Weak",

        veryWeak: "Very Weak"

    };

    let prefix;

    if (score >= 90) {

        prefix = levels.excellent;

    } else if (score >= 80) {

        prefix = levels.strong;

    } else if (score >= 70) {

        prefix = levels.good;

    } else if (score >= 60) {

        prefix = levels.moderate;

    } else if (score >= 40) {

        prefix = levels.weak;

    } else {

        prefix = levels.veryWeak;

    }

    return `${prefix} ${metric}`;

}

module.exports = {

    clampScore,

    getGrade,

    getInterpretation

};