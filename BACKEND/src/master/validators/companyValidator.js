/**
 * BullVision Company Validator
 * Validates the structure of a Company object.
 */

function validateCompany(company) {

    // Company must be an object
    if (!company || typeof company !== "object") {
        throw new Error("Company must be a valid object.");
    }

    // Company ID
    if (!company.id) {
        throw new Error("Company ID is required.");
    }

    if (!/^COMP\d{6}$/.test(company.id)) {
        throw new Error(`Invalid Company ID: ${company.id}`);
    }

    // Company Name
    if (!company.name || company.name.trim() === "") {
        throw new Error(`Company ${company.id} has an invalid name.`);
    }

    // Listings
    if (!Array.isArray(company.listings)) {
        throw new Error(`Company ${company.id} must contain listings.`);
    }

    if (company.listings.length === 0) {
        throw new Error(`Company ${company.id} has no listings.`);
    }

    // Validate each listing
    const exchanges = new Set();

    for (const listing of company.listings) {

        if (!listing.exchange) {
            throw new Error(`Company ${company.id} has a listing without exchange.`);
        }

        if (!["NSE", "BSE"].includes(listing.exchange)) {
            throw new Error(
                `Invalid exchange '${listing.exchange}' in ${company.id}.`
            );
        }

        if (exchanges.has(listing.exchange)) {
            throw new Error(
                `${company.id} contains duplicate ${listing.exchange} listings.`
            );
        }

        exchanges.add(listing.exchange);

        if (!listing.symbol || listing.symbol.trim() === "") {
            throw new Error(
                `${company.id} contains an invalid trading symbol.`
            );
        }

        if (!listing.token || listing.token.trim() === "") {
            throw new Error(
                `${company.id} contains an invalid token.`
            );
        }

    }

    return true;

}

function validateCompanies(companies) {

    if (!Array.isArray(companies)) {
        throw new Error("Company Master must be an array.");
    }

    for (const company of companies) {
        validateCompany(company);
    }

    return companies;

}

module.exports = {
    validateCompany,
    validateCompanies
};