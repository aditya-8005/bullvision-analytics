require("dotenv").config();

const { generateSession } = require("../src/market/providers/angelOneProvider");

async function testAngelLogin() {
    console.log("======================================");
    console.log(" BullVision - Angel One Login Test");
    console.log("======================================\n");

    try {
        const session = await generateSession();

        console.log("✅ Login Successful\n");

        console.log("JWT Token:");
        console.log(session.data.jwtToken);

        console.log("\nFeed Token:");
        console.log(session.data.feedToken);

        console.log("\nRefresh Token:");
        console.log(session.data.refreshToken);

    } catch (error) {

        console.log("\n❌ Login Failed\n");

        console.error(error);

    }
}

testAngelLogin();