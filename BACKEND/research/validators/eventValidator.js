const fs = require("fs");
const path = require("path");

const {
    REQUIRED_SECTIONS
} = require("./validationRules");

const EVENTS_DIRECTORY = path.join(__dirname, "..", "events");

function validateEvent(event, filename) {

    const errors = [];

    // ----------------------------------------------------
    // Required Sections
    // ----------------------------------------------------

    for (const section of REQUIRED_SECTIONS) {

        if (!(section in event)) {

            errors.push(`Missing section: ${section}`);

        }

    }

    return errors;

}

function runValidator() {

    console.log("\n========================================");
    console.log("BullVision Research Validator");
    console.log("========================================\n");

    const files = fs
        .readdirSync(EVENTS_DIRECTORY)
        .filter(file => file.endsWith(".json"));

    let passed = 0;
    let failed = 0;

    const ids = new Set();
    const displayOrders = new Set();

    for (const file of files) {

        try {

            const filePath = path.join(EVENTS_DIRECTORY, file);

            const rawData = fs.readFileSync(filePath, "utf-8");

            const event = JSON.parse(rawData);

            const errors = validateEvent(event, file);

            // ----------------------------
            // Duplicate ID
            // ----------------------------

            if (event.identity) {

                if (ids.has(event.identity.id)) {

                    errors.push("Duplicate identity.id");

                } else {

                    ids.add(event.identity.id);

                }

                if (displayOrders.has(event.identity.displayOrder)) {

                    errors.push("Duplicate displayOrder");

                } else {

                    displayOrders.add(event.identity.displayOrder);

                }

            }

            if (errors.length === 0) {

                console.log(`✓ ${file}`);

                passed++;

            } else {

                console.log(`✗ ${file}`);

                errors.forEach(error => {

                    console.log(`   - ${error}`);

                });

                console.log("");

                failed++;

            }

        } catch (err) {

            console.log(`✗ ${file}`);
            console.log(`   Invalid JSON`);
            console.log(`   ${err.message}\n`);

            failed++;

        }

    }

    console.log("----------------------------------------\n");

    console.log(`Events Checked : ${files.length}`);
    console.log(`Passed         : ${passed}`);
    console.log(`Failed         : ${failed}`);

    console.log("");

    if (failed === 0) {

        console.log("Knowledge Base Status");
        console.log("✓ VALID\n");

    } else {

        console.log("Knowledge Base Status");
        console.log("✗ INVALID\n");

    }

}

runValidator();