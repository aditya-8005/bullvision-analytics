/**
 * Generates BullVision Insight
 * from analytics and scores.
 */

function generateInsight({

    drawdown,

    recovery,

    volatility,

    relativePerformance,

    resilience

}) {

    const strengths = [];
    const weaknesses = [];

    if (
        resilience.breakdown.crashResistance.score >= 80
    ) {

        strengths.push(
            "Demonstrated strong crash resistance."
        );

    } else {

        weaknesses.push(
            "Experienced significant drawdowns."
        );

    }

    if (recovery.recovered) {

        if (recovery.recoveryDays <= 90) {

            strengths.push(
                "Recovered quickly after the crisis."
            );

        } else {

            weaknesses.push(
                "Recovery required considerable time."
            );

        }

    } else {

        weaknesses.push(
            "Has not recovered to the previous peak."
        );

    }

    if (relativePerformance) {

    if (relativePerformance.outperformer === "A") {

        strengths.push(
            "Outperformed benchmark during the event."
        );

    } else if (relativePerformance.outperformer === "B") {

        weaknesses.push(
            "Underperformed benchmark."
        );

    }

}

    if (volatility.volatility <= 0.03) {

        strengths.push(
            "Maintained relatively stable price movements."
        );

    } else {

        weaknesses.push(
            "High price volatility observed."
        );

    }

    let summary;

    if (resilience.score >= 85) {

        summary =
            "Excellent long-term resilience during historical market stress.";

    } else if (resilience.score >= 70) {

        summary =
            "Strong historical resilience with manageable risks.";

    } else if (resilience.score >= 50) {

        summary =
            "Moderate resilience with noticeable weaknesses.";

    } else {

        summary =
            "Historically vulnerable during major market events.";

    }

    return {

        summary,

        strengths,

        weaknesses,

    };

}

module.exports = {
    generateInsight,
};