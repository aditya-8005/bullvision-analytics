const NotFoundError = require("../../errors/NotFoundError");
const ExternalServiceError = require("../../errors/ExternalServiceError");
const { getQuote } = require("../providers/angelOneProvider");
const { getCompanyProfile } = require("../providers/yahooProvider");

const {
    findInstrument,
} = require("./instrumentService");

const {
    mapQuote,
} = require("../mappers/quoteMapper");

/**
 * Fetches live stock quote.
 *
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
const fetchStockQuote = async (symbol) => {

    const instrument = findInstrument(symbol);

    if (!instrument) {
        throw new NotFoundError(
            `Stock "${symbol}" not found.`
        );
    }

    try {
        const quotePromise = getQuote(
            instrument.exch_seg,
            instrument.token
        );
        
        // Yahoo requires the suffix .NS
        const baseSymbol = instrument.symbol.replace('-EQ', '');
        const yahooSymbol = `${baseSymbol}.NS`;
        const profilePromise = getCompanyProfile(yahooSymbol);
        
        const [quote, profile] = await Promise.all([quotePromise, profilePromise]);

        const mappedQuote = mapQuote(
            quote,
            instrument
        );
        
        return {
            ...mappedQuote,
            profile: profile || null
        };

    } catch (error) {

        if (error.name === "ExternalServiceError") {
            throw error;
        }

        throw new ExternalServiceError(
            "Unable to fetch live market data."
        );
    }
};
module.exports = {
    fetchStockQuote,
};