require("dotenv").config();

const {
    getQuote,
} = require("../src/market/providers/angelOneProvider");

async function main() {
    try {

        console.log("Fetching Reliance Quote...\n");

        const quote = await getQuote("NSE", "2885");

        console.log(quote);

    } catch (error) {

        console.error(error.message);

    }
}

main();