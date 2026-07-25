const {
    calculateRecoveryScore
} = require(
    "../src/analytics/scoring/recoveryScore"
);

console.log(
    "========== Recovery Score ==========\n"
);

const samples = [

    {
        days: 20,
        recovered: true
    },

    {
        days: 60,
        recovered: true
    },

    {
        days: 120,
        recovered: true
    },

    {
        days: 250,
        recovered: true
    },

    {
        days: 365,
        recovered: true
    },

    {
        days: null,
        recovered: false
    }

];

for (const sample of samples) {

    console.log(sample);

    console.log(

        calculateRecoveryScore(

            sample.days,

            sample.recovered

        )

    );

    console.log();

}

console.log(
    "===================================="
);