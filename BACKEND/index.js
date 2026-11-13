const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const {
    initializeInstrumentMaster,
} = require("./src/market/loaders/instrumentLoader");

const {
    loadInstruments,
} = require("./src/market/services/instrumentService");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { verifyDatabaseConnection } = require("./src/config/supabase");

const authRoutes = require("./src/routes/auth.routes");
const portfolioRoutes = require("./src/routes/portfolio.routes");
const marketRoutes = require("./src/routes/market.routes");
const eventAnalysisRoutes = require("./src/routes/eventAnalysis.routes");
const eventRoutes = require("./src/routes/event.routes");
const systemRoutes = require("./src/routes/system.routes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

// Enable trust proxy so rate limiting works behind reverse proxies (Render, Railway, Vercel, etc.)
// Without this, req.ip will be the proxy's IP and all users will share the same rate limit.
app.set("trust proxy", 1);

// ================= CORS Configuration =================
const parseCorsOrigins = () => {
    if (process.env.NODE_ENV !== "production") {
        return true;
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        console.warn("⚠️ FRONTEND_URL is not set in production. Browser requests will be blocked by CORS.");
        return false;
    }

    // Support single origin or comma-separated origins, stripping any trailing slash
    return frontendUrl
        .split(",")
        .map(url => url.trim().replace(/\/$/, ""))
        .filter(Boolean);
};

// ================= Global Middlewares =================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: parseCorsOrigins(),
    credentials: true
}));

app.use(express.json());

// ================= Health & System Routes =================
// Mounted BEFORE rate limiting so uptime monitors / Render health checks are never rate-limited
app.use("/", systemRoutes);

// ================= Rate Limiting for Application Routes =================
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

app.use(apiLimiter);

// ================= Readiness Guard Middleware =================
// Guard application routes during background initialization
let isReady = false;
let initError = null;

app.use((req, res, next) => {
    if (isReady) {
        return next();
    }

    if (initError) {
        return res.status(503).json({
            success: false,
            message: "Service temporarily unavailable due to initialization error. Please try again shortly.",
        });
    }

    res.set("Retry-After", "5");
    return res.status(503).json({
        success: false,
        message: "Server is initializing dependencies. Please try again shortly.",
    });
});

// ================= Application Routes =================
app.use("/auth", authRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/market", marketRoutes);
app.use("/api/event-analysis", eventAnalysisRoutes);
app.use("/events", eventRoutes);

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

        // Start Express Server immediately so Render port binding succeeds within startup timeout
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

        // ================= Asynchronous Dependency Initialization =================
        try {
            // 1. Verify Supabase connection with a 15-second timeout safeguard
            try {
                await Promise.race([
                    verifyDatabaseConnection(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Supabase connection check timed out (15s)")), 15000)
                    ),
                ]);
                console.log("✅ Supabase PostgreSQL connection verified.");
            } catch (dbError) {
                console.warn("⚠️ Initial Supabase connection check warning:", dbError.message);
                // Non-fatal on cold start: Supabase free tier may be waking up
            }

            // 2. Initialize Instrument Master
            const instrumentData = await initializeInstrumentMaster();

            // 3. Load Instruments into Memory (optimized for low memory footprint)
            loadInstruments(instrumentData);

            isReady = true;
            console.log("✅ BullVision application dependencies initialized and ready.");

        } catch (initErr) {
            initError = initErr;
            console.error("❌ Failed to initialize application dependencies:", initErr.message);
        }

    } catch (error) {
        console.error("Failed to start BullVision server.");
        console.error(error);
        process.exit(1);
    }
};

startServer();
