const { analyzeEvent } = require("../src/analytics/services/eventAnalysisService");

async function test() {
    const result = await analyzeEvent(
        "HDFCBANK_NS",
        "COVID_2020"
    );

    console.log(JSON.stringify(result, null, 4));
}

test().catch(console.error);