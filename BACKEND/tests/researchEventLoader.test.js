const {
    loadResearchEvents
} = require("../src/research/loaders/researchEventLoader");

console.log("========== Research Events ==========\n");

const events = loadResearchEvents();

console.log(events);

console.log("\n=====================================");