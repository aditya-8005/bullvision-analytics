require("dotenv").config();

const {
    initializeInstrumentMaster,
} = require("../src/market/loaders/instrumentLoader");

const {
    loadInstruments,
    searchInstruments,
} = require("../src/market/services/instrumentService");

async function main() {
    try {

        console.log("Initializing Instrument Master...");

        const instrumentData = await initializeInstrumentMaster();

        loadInstruments(instrumentData);

        console.log("\nSearching for RELIANCE...\n");

        const results = searchInstruments("RELIANCE");

        console.log(results.slice(0, 5));

    } catch (error) {

        console.error(error);

    }
}

main();