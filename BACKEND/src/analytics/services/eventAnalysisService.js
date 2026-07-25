const AppError = require("../../errors/AppError");

const {
    getHistoryBetween,
} = require("../../market/services/marketService");

const {
    getEventById,
    getAllEvents,
} = require("../../market/services/eventService");

const {
    analyzeHistory,
} = require("./analyticsService");

function buildAnalysisResponse({
    symbol,
    event,
    status,
    history = [],
    analytics = null,
    message = null,
}) {
    return {
        symbol,
        event,
        status,
        history,
        analytics,
        message,
    };
}

async function analyzeEvent(symbol, eventId, benchmarkSymbol = null) {

    const event = await getEventById(eventId);
    const history = await getHistoryBetween(
        symbol,
        event.startDate,
        event.endDate
    );

    if (!history.length) {
        return buildAnalysisResponse({
            symbol,
            event,
            status: "NOT_LISTED",
            message: "This company was not publicly listed during this historical event.",
        });
    }

    // Defense-in-depth: the analytics calculators require ≥2 candles.
    // If Yahoo Finance also returned sparse data (e.g. very old events,
    // partial trading days), return a structured response instead of
    // crashing the calculator pipeline.
    if (history.length < 2) {
        return buildAnalysisResponse({
            symbol,
            event,
            status: "NO_DATA",
            history,
            analytics: null,
            message: `Insufficient historical data for analysis (only ${history.length} trading day found).`,
        });
    }

    let benchmarkHistory = null;

    if (benchmarkSymbol) {
        benchmarkHistory = await getHistoryBetween(
            benchmarkSymbol,
            event.startDate,
            event.endDate
        );
    }

    const analytics = analyzeHistory(
        history,
        benchmarkHistory
    );

    return buildAnalysisResponse({
        symbol,
        event,
        status: "SUCCESS",
        history,
        analytics,
    });
}

async function analyzeAllEvents(symbol, benchmarkSymbol = null) {
    const events = await getAllEvents();
    const promises = events.map(event => analyzeEvent(symbol, event.id, benchmarkSymbol));
    const results = await Promise.allSettled(promises);

    return results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
}

module.exports = {
    analyzeEvent,
    analyzeAllEvents,
};
