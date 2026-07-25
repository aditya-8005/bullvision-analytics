require("dotenv").config();

const {
    getHistoricalData,
} = require("../src/market/services/historyService");

(async () => {

    try {

        console.log("Fetching Historical Data...\n");

        const result = await getHistoricalData({

            exchange: "NSE",

            symbolToken: "2885",

            interval: "ONE_DAY",

            from: "2024-01-01",

            to: "2024-01-31",

        });

        console.log(result);

    }

    catch (error) {

        console.error(error.message);

    }

})();