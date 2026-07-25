const {
    analyzeEvent,
    analyzeAllEvents,
} = require("../analytics/services/eventAnalysisService");

async function getEventAnalysis(req, res, next) {

    try {

        const { symbol, eventId } = req.params;

        const analytics = await analyzeEvent(
            symbol,
            eventId
        );

        return res.status(200).json({
            success: true,
            data: analytics
        });

    } catch (error) {

        next(error);

    }

}



async function getAllEventAnalytics(req, res, next) {
    try {
        const { symbol } = req.params;

        const analytics = await analyzeAllEvents(symbol);

        return res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getEventAnalysis,
    getAllEventAnalytics,
};