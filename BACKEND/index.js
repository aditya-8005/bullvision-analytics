const {
    initializeInstrumentMaster,
} = require("./src/market/loaders/instrumentLoader");


const {
    loadInstruments,
} = require("./src/market/services/instrumentService");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { verifyDatabaseConnection } = require("./src/config/supabase");

const authRoutes = require("./src/routes/auth.routes");
const portfolioRoutes = require("./src/routes/portfolio.routes");
const marketRoutes = require("./src/routes/market.routes");
const eventAnalysisRoutes = require("./src/routes/eventAnalysis.routes");
const eventRoutes = require("./src/routes/event.routes");

const errorHandler = require("./src/middlewares/errorHandler");
const systemRoutes = require("./src/routes/system.routes");
const app = express();

// Enable trust proxy so rate limiting works behind reverse proxies (Railway, Vercel, Heroku, etc.)
// Without this, req.ip will be the proxy's IP and all users will share the same rate limit.
app.set("trust proxy", 1);

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ================= Middleware =================
const corsOrigin = process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : true;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: corsOrigin,
    credentials: true
}));
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

app.use(apiLimiter);

// ================= Routes =================
app.use("/auth", authRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/market", marketRoutes);
app.use("/api/event-analysis", eventAnalysisRoutes);
app.use("/events", eventRoutes);
app.use("/", systemRoutes);
// ================= Health Check =================


// ================= Global Error Handler =================
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        if (!process.env.JWT_SECRET) {
            throw new Error("Missing required environment variable: JWT_SECRET");
        }

        // Verify the Supabase PostgreSQL connection before accepting requests.
        await verifyDatabaseConnection();

        // Initialize Instrument Master
        const instrumentData = await initializeInstrumentMaster();

        // Load Instruments into Memory
        loadInstruments(instrumentData);

        // Start Express Server
        const server = app.listen(PORT, () => {
            console.log(`🚀 BullVision Server running on port ${PORT}`);
        });

        // ================= Graceful Shutdown =================
        const shutdown = (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(() => {
                console.log("Closed out remaining connections.");
                process.exit(0);
            });

            // Force shutdown after 10 seconds if connections are hanging
            setTimeout(() => {
                console.error("Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 10000).unref();
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

        process.on("uncaughtException", (error) => {
            console.error("Uncaught Exception! Shutting down...");
            console.error(error);
            process.exit(1);
        });

        process.on("unhandledRejection", (error) => {
            console.error("Unhandled Rejection! Shutting down...");
            console.error(error);
            server.close(() => {
                process.exit(1);
            });
        });

    } catch (error) {

        console.error("Failed to start BullVision.");
        console.error(error);
        process.exit(1);

    }

};

startServer();
