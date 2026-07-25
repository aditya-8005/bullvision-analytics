const axios = require("axios");

const {
    getAuthToken,
    clearSession,
} = require("../../utils/tokenManager");

const { buildHeaders } = require("./angelOneProvider");

const BASE_URL = "https://apiconnect.angelone.in";

function formatFromDate(date) {
    return `${date} 09:15`;
}

function formatToDate(date) {
    return `${date} 15:30`;
}

async function fetchHistory(
    jwtToken,
    exchange,
    symbolToken,
    interval,
    from,
    to
) {

    const response = await axios.post(

        `${BASE_URL}/rest/secure/angelbroking/historical/v1/getCandleData`,

        {
            exchange,
            symboltoken: symbolToken,
            interval,
            fromdate: formatFromDate(from),
            todate: formatToDate(to),
        },

        {
            headers: buildHeaders(jwtToken),
        }

    );

    return response.data;
}

async function fetchHistoricalData(request) {

    const {
        exchange,
        symbolToken,
        interval,
        from,
        to,
    } = request;

    try {

        const jwtToken = await getAuthToken();

        return await fetchHistory(
            jwtToken,
            exchange,
            symbolToken,
            interval,
            from,
            to
        );

    }

    catch (error) {

        const isInvalidToken =
            error.response?.data?.message === "Invalid Token";

        if (!isInvalidToken) {
            throw error;
        }

        console.log("🔄 Session expired. Re-authenticating...");

        clearSession();

        const newJwtToken = await getAuthToken();

        return await fetchHistory(
            newJwtToken,
            exchange,
            symbolToken,
            interval,
            from,
            to
        );
    }
}

module.exports = {
    fetchHistoricalData,
};