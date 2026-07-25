const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const INSTRUMENT_URL =
    "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json";

const INSTRUMENT_FILE = path.join(
    __dirname,
    "..",
    "data",
    "instruments.json"
);

const downloadInstrumentMaster = async () => {
    try {
        console.log("Downloading Instrument Master...");

        const response = await axios.get(INSTRUMENT_URL, {
            timeout: 120000,
        });

        await fs.writeJson(INSTRUMENT_FILE, response.data, {
            spaces: 2,
        });

        console.log("Instrument Master downloaded successfully.");

        return true;

    } catch (error) {

        console.error("Failed to download Instrument Master.");

        throw error;
    }
};

const loadInstrumentMaster = async () => {
    try {

        console.log("Loading Instrument Master...");

        const instruments = await fs.readJson(INSTRUMENT_FILE);

        console.log(
            `Loaded ${instruments.length} instruments successfully.`
        );

        return instruments;

    } catch (error) {

        console.error("Failed to load Instrument Master.");

        throw error;

    }
};

const initializeInstrumentMaster = async () => {
    try {

        const fileExists = await fs.pathExists(INSTRUMENT_FILE);

        if (!fileExists) {

            console.log("Instrument Master not found locally.");
            console.log("Downloading a fresh copy...");

            await downloadInstrumentMaster();

        } else {

            console.log("Instrument Master found locally.");

        }

        return await loadInstrumentMaster();

    } catch (error) {

        console.error("Failed to initialize Instrument Master.");

        throw error;

    }
};

module.exports = {
    initializeInstrumentMaster,
    downloadInstrumentMaster,
    loadInstrumentMaster,
};