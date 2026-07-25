const { verifyDatabaseConnection } = require("../config/supabase");

const healthCheck = async (req, res) => {
    let database = "connected";

    try {
        await verifyDatabaseConnection();
    } catch (error) {
        database = "disconnected";
    }

    res.status(200).json({
        success: true,
        status: "UP",
        service: "BullVision Backend",
        version: "1.0.0",
        environment: process.env.NODE_ENV,
        uptime: Number(process.uptime().toFixed(2)),
        database,
        timestamp: new Date().toISOString(),
    });
};

module.exports = {
    healthCheck,
};
