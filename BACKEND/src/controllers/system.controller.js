const { verifyDatabaseConnection } = require("../config/supabase");

let lastDbCheck = 0;
let cachedDbStatus = "unknown";
const DB_CHECK_CACHE_MS = 30000; // Cache DB status for 30s to keep health checks lightweight

const checkDatabase = async () => {
    const now = Date.now();
    if (cachedDbStatus !== "unknown" && (now - lastDbCheck) < DB_CHECK_CACHE_MS) {
        return cachedDbStatus;
    }

    try {
        await Promise.race([
            verifyDatabaseConnection(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Database check timeout")), 5000)
            ),
        ]);
        cachedDbStatus = "connected";
    } catch (error) {
        cachedDbStatus = "disconnected";
    }

    lastDbCheck = now;
    return cachedDbStatus;
};

const healthCheck = async (req, res) => {
    const database = await checkDatabase();

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
