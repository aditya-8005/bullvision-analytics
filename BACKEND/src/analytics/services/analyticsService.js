const { calculateReturn } = require("../calculators/returnCalculator");
const { calculateStatistics } = require("../calculators/statisticsCalculator");
const { calculateDrawdown } = require("../calculators/drawdownCalculator");
const { calculateVolatility } = require("../calculators/volatilityCalculator");
const { calculateRecovery } = require("../calculators/recoveryCalculator");
const { calculateRelativePerformance } = require("../calculators/relativePerformanceCalculator");

const {
    calculateCrashResistance,
} = require("../scoring/crashResistanceScore");

const {
    calculateRecoveryScore,
} = require("../scoring/recoveryScore");

const {
    calculateMarketStrengthScore,
} = require("../scoring/marketStrengthScore");

const {
    calculateStabilityScore,
} = require("../scoring/stabilityScore");

const {
    calculateResilienceScore,
} = require("../scoring/resilienceScore");

const {
    generateInsight,
} = require("../insights/insightGenerator");

function analyzeHistory(history, benchmarkHistory = null) {

    const returns = calculateReturn(history);

    const statistics = calculateStatistics(history);

    const drawdown = calculateDrawdown(history);

    const volatility = calculateVolatility(history);

    const recovery = calculateRecovery(history, drawdown);

    let relativePerformance = null;

    if (benchmarkHistory) {

        relativePerformance =
            calculateRelativePerformance(
                history,
                benchmarkHistory
            );

    }

    const crashResistance =
        calculateCrashResistance(
            drawdown.drawdownPercentage
        );

    const recoveryAbility =
        calculateRecoveryScore(
            recovery.recoveryDays,
            recovery.recovered
        );

    const stability =
        calculateStabilityScore(
            volatility.volatility
        );

    const marketStrength =
    relativePerformance
        ? calculateMarketStrengthScore(
              relativePerformance.relativePerformance
          )
        : {
              score: 50,
              grade: "C",
              interpretation:
                  "Benchmark comparison unavailable.",
          };

    const resilience =
        calculateResilienceScore({

            crashResistance,

            recoveryAbility,

            marketStrength,

            stability,

        });

    const insights =
        generateInsight({

            drawdown,

            recovery,

            volatility,

            relativePerformance,

            resilience,

        });

    return {

        returns,

        statistics,

        drawdown,

        volatility,

        recovery,

        relativePerformance,

        scores: {

            crashResistance,

            recoveryAbility,

            marketStrength,

            stability,

            resilience,

        },

        insights,

    };

}

module.exports = {
    analyzeHistory,
};