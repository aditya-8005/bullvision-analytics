const {
    loadResearchEvents
} = require("../src/research/loaders/researchEventLoader");

const {
    validateResearchEvent
} = require("../src/research/validators/researchValidator");

console.log("========== Research Validation ==========\n");

const events = loadResearchEvents();

for (const event of events) {

    try {

        validateResearchEvent(event);

        console.log(`✅ ${event.id} passed validation.`);

    } catch (error) {

        console.error(`❌ ${event.id}`);

        console.error(error.message);

    }

}

console.log("\n=========================================");