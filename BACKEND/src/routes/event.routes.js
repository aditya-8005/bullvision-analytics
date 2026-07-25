const express = require("express");

const router = express.Router();

const {
    getEvents,
    getEvent,
    getCategoryEvents,
} = require("../controllers/eventController");

router.get("/", getEvents);

router.get("/category/:category", getCategoryEvents);

router.get("/:id", getEvent);

module.exports = router;