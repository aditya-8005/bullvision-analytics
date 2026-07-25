const axios = require("axios");

const {
    getAuthToken,
    clearSession,
} = require("../../utils/tokenManager");

const BASE_URL = "https://apiconnect.angelone.in";

const API_KEY = process.env.ANGEL_API_KEY;
const CLIENT_CODE = process.env.ANGEL_CLIENT_CODE;
const MPIN = process.env.ANGEL_MPIN;
const TOTP_SECRET = process.env.ANGEL_TOTP_SECRET;



/**
 * Builds the common headers required by Angel One APIs.
 *
 * @param {string} jwtToken
 * @returns {Object}
 */
const buildHeaders = (jwtToken) => ({
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-PrivateKey": API_KEY,
    "X-ClientLocalIP": "127.0.0.1",
    "X-ClientPublicIP": "127.0.0.1",
    "X-MACAddress": "00:00:00:00:00:00",
});


/**
 * Fetches live market quote from Angel One.
 *
 * @param {string} exchange
 * @param {string} symbolToken
 * @returns {Promise<Object>}
 */
const getQuote = async (exchange, symbolToken) => {

    try {

        const jwtToken = await getAuthToken();

        return await fetchQuote(jwtToken, exchange, symbolToken);

    } catch (error) {

        const isInvalidToken =
            error.response?.data?.message === "Invalid Token";

        if (!isInvalidToken) {
            throw error;
        }

        console.log("🔄 Session expired. Re-authenticating...");

        clearSession();

        const newJwtToken = await getAuthToken();

        return await fetchQuote(
            newJwtToken,
            exchange,
            symbolToken
        );
    }
};

const fetchQuote = async (jwtToken, exchange, symbolToken) => {

    const response = await axios.post(
        `${BASE_URL}/rest/secure/angelbroking/market/v1/quote`,
        {
            mode: "FULL",
            exchangeTokens: {
                [exchange]: [symbolToken],
            },
        },
        {
            headers: buildHeaders(jwtToken),
        }
    );

    const fetched = response.data?.data?.fetched;

    if (!Array.isArray(fetched) || fetched.length === 0) {
        throw new Error("No market data returned from Angel One.");
    }

    return fetched[0];
};

module.exports = {
    
    buildHeaders,
    getQuote,
};