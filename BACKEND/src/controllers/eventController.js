const {
    getAllEvents,
    getEventById,
    getEventsByCategory,
} = require("../market/services/eventService");

async function getEvents(req, res, next) {

    try {

        const events = await getAllEvents();

        return res.status(200).json({
            success: true,
            data: events,
        });

    } catch (error) {

        next(error);

    }

}

async function getEvent(req, res, next) {

    try {

        const { id } = req.params;

        const event = await getEventById(id);

        return res.status(200).json({
            success: true,
            data: event,
        });

    } catch (error) {

        next(error);

    }

}

async function getCategoryEvents(req, res, next) {

    try {

        const { category } = req.params;

        const events = await getEventsByCategory(category);

        return res.status(200).json({
            success: true,
            data: events,
        });

    } catch (error) {

        next(error);

    }

}

module.exports = {
    getEvents,
    getEvent,
    getCategoryEvents,
};
