const express = require("express");
const rateLimit = require("express-rate-limit");

const verifyJwt = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const {
    registerSchema,
    loginSchema,
} = require("../validators/authValidator");

const {
    registerUser,
    loginUser,
    logoutUser,
    profileUser,
} = require("../controllers/authController");

const router = express.Router();

// ===============================
// Rate Limiters
// ===============================

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes.",
    },
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many registration attempts. Please try again after 15 minutes.",
    },
});

// ===============================
// Authentication Routes
// ===============================

router.post(
    "/register",
    registerLimiter,
    validate(registerSchema),
    registerUser
);

router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    loginUser
);

router.get(
    "/profile",
    verifyJwt,
    profileUser
);

router.post(
    "/logout",
    verifyJwt,
    logoutUser
);

module.exports = router;