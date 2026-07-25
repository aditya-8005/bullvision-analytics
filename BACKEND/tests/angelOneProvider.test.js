require("dotenv").config();

const {
    generateSession,
} = require("../src/market/providers/angelOneProvider");

async function main() {
    try {

        console.log("========== TESTING ANGEL ONE LOGIN ==========\n");

        const response = await generateSession();

        console.log("✅ Login Successful!\n");

        console.log(response);

    } catch (error) {

        console.error("\n❌ Login Failed\n");

        console.error(error.response?.data || error.message);

    }
}

main();