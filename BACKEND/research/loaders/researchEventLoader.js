const fs = require("fs");
const path = require("path");

/**
 * Absolute path to the research/events directory.
 */
const EVENTS_DIRECTORY = path.join(
    process.cwd(),
    "research",
    "events"
);

/**
 * Loads all research event JSON files.
 *
 * Responsibilities:
 * - Read the research/events directory.
 * - Load every JSON file.
 * - Parse JSON into JavaScript objects.
 * - Ignore non-JSON files.
 * - Return an array of events.
 *
 * Validation is NOT performed here.
 *
 * @returns {Array<Object>}
 */
function loadResearchEvents() {

    if (!fs.existsSync(EVENTS_DIRECTORY)) {
        throw new Error(
            `Research events directory not found: ${EVENTS_DIRECTORY}`
        );
    }

    const files = fs
        .readdirSync(EVENTS_DIRECTORY)
        .filter(file => file.endsWith(".json"));

    if (files.length === 0) {
        return [];
    }

    const events = [];

    for (const file of files) {

        const filePath = path.join(
            EVENTS_DIRECTORY,
            file
        );

        try {

            const rawData = fs.readFileSync(
                filePath,
                "utf-8"
            );

            const event = JSON.parse(rawData);

            events.push(event);

        } catch (error) {

            throw new Error(
                `Failed to load research event "${file}": ${error.message}`
            );

        }

    }

    return events;

}

module.exports = {

    loadResearchEvents

};