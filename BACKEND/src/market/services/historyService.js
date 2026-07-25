const { validateHistoryRequest } = require("../validators/historyValidator");

const {
    fetchHistoricalData,
} = require("../providers/angelOneHistoryProvider");

const {
    mapHistoricalData,
} = require("../mappers/historyMapper");

async function getHistoricalData(request) {

    validateHistoryRequest(request);

    const rawData = await fetchHistoricalData(request);

    return mapHistoricalData(rawData, request);

}

module.exports = {
    getHistoricalData,
};