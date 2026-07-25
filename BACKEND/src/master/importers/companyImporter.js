const fs = require("fs");
const path = require("path");

const equityFilter = require("../config/equityFilter");
const { createCompany } = require("../models/Company");
const { validateCompanies } = require("../validators/companyValidator");
const { readJson, writeJson } = require("../utils/fileUtils");
/**
 * Step 1
 * Load Angel One Instrument Master
 */
function loadRawData() {
    const filePath = path.join(
        __dirname,
        "..",
        "raw",
        "angel",
        "OpenAPIScripMaster.json"
    );

    const rawData = fs.readFileSync(filePath, "utf8");

    return JSON.parse(rawData);
}

/**
 * Step 2
 * Filter only NSE & BSE Cash Equities
 */
function filterCashEquities(instruments) {
    return instruments.filter((instrument) => {

        // Only supported exchanges
        if (!equityFilter.supportedExchanges.includes(instrument.exch_seg)) {
            return false;
        }

        // Cash Market Only
        if (instrument.instrumenttype !== "") {
            return false;
        }

        // BSE Cash Equities
        if (instrument.exch_seg === "BSE") {
            return true;
        }

        // NSE Cash Equities
        const symbol = instrument.symbol || "";

        const lastDash = symbol.lastIndexOf("-");

        if (lastDash === -1) {
            return false;
        }

        const series = symbol.substring(lastDash + 1);

        return equityFilter.supportedSeries.includes(series);

    });
}

/**
 * Step 3
 * Convert Angel One Records into BullVision Company Objects
 */
function transformCompanies(equities) {

    return equities.map((instrument, index) =>
        createCompany({

            id: `COMP${String(index + 1).padStart(6, "0")}`,

            name: instrument.name,

            listings: [
                {
                    exchange: instrument.exch_seg,
                    symbol: instrument.symbol,
                    token: instrument.token
                }
            ]

        })
    );

}

/**
 * Step 4
 * Merge NSE & BSE Listings
 */
function mergeListings(companies) {

    const mergedCompanies = new Map();

    for (const company of companies) {

        const companyName = company.name;

        if (!mergedCompanies.has(companyName)) {

            mergedCompanies.set(companyName, company);

            continue;

        }

        const existingCompany = mergedCompanies.get(companyName);

        existingCompany.listings.push(...company.listings);

    }

    return [...mergedCompanies.values()];

}

/**
 * Step 5
 * Write Company Master
 */
function writeCompanyMaster(companies) {

    const outputPath = path.join(
        __dirname,
        "..",
        "generated",
        "companies.json"
    );

    fs.writeFileSync(
        outputPath,
        JSON.stringify(companies, null, 2),
        "utf8"
    );

    console.log("\n✅ Company Master written successfully.");
    console.log(outputPath);

}

/**
 * Main ETL Pipeline
 */
function generateCompanyMaster() {

    // Step 1
    const instruments = loadRawData();

    // Step 2
    const equities = filterCashEquities(instruments);

    // Step 3
    const transformedCompanies = transformCompanies(equities);

    // Step 4
    const mergedCompanies = mergeListings(transformedCompanies);

    // Step 5
    const validatedCompanies = validateCompanies(mergedCompanies);

    // Step 6
    writeCompanyMaster(validatedCompanies);

    console.log("\n======================================");
    console.log("BullVision Company Importer");
    console.log("======================================\n");

    console.log(`Loaded Instruments  : ${instruments.length}`);
    console.log(`Cash Equities       : ${equities.length}`);
    console.log(`Transformed Records : ${transformedCompanies.length}`);
    console.log(`Unique Companies    : ${validatedCompanies.length}`);

    console.log("\nFirst Company:\n");

    console.log(
        JSON.stringify(
            validatedCompanies[0],
            null,
            2
        )
    );

}

module.exports = {
    generateCompanyMaster
};