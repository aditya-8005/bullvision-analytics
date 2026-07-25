module.exports = Object.freeze({

    MAX_EXPECTED_DRAWDOWN: 70,

    MAX_EXPECTED_RECOVERY_DAYS: 365,

    MAX_EXPECTED_VOLATILITY: 0.10,

    RESILIENCE_WEIGHTS: Object.freeze({

        crashResistance: 0.35,

        recoveryAbility: 0.30,

        marketStrength: 0.20,

        stability: 0.15

    })

});
