const {

    getAllEvents,

    getEventById,

    getEventsByCategory,

    getApplicableEvents

} = require("../src/events/services/eventService");

console.log("========== Event Service Test ==========\n");

const allEvents = getAllEvents();

console.log("Total Events:");

console.log(allEvents.length);

const event = getEventById(

    "global-financial-crisis-2008"

);

console.log("\nEvent Name:");

if (event.name === "Global Financial Crisis (2008)") {

    console.log("✅ getEventById Passed");

}
else {

    console.log("❌ getEventById Failed");

}

const globalEvents = getEventsByCategory("GLOBAL");

console.log("\nGlobal Events:");

console.log(globalEvents.length);

const applicable = getApplicableEvents(

    "2005-01-01"

);

console.log("\nApplicable Events:");

console.log(applicable.length);