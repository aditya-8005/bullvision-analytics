/**
 * BullVision Company Factory
 * Creates a standardized Company object.
 */

function createCompany({
    id,
    name,
    listings
}) {

    return {
        id,
        name,
        listings
    };

}

module.exports = {
    createCompany
};