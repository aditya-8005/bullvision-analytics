const {
    getResearchEvents,
    getResearchEventById
} = require("../src/research/services/researchService");

console.log("========== Research Service ==========\n");

const events = getResearchEvents();

console.log("Total Events:", events.length);

console.log("\nFirst Event:");

console.log(events[0]);

console.log("\nLookup by ID:");

console.log(
    getResearchEventById(
        "global-financial-crisis-2008"
    )
);

console.log("\n======================================");