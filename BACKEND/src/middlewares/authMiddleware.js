const jwt = require("jsonwebtoken");

// ── Mirror the same constants used in authService.js ─────────────────────────
const JWT_ALGORITHM = "HS256";
const JWT_ISSUER    = "bullvision-api";
const JWT_AUDIENCE  = "bullvision-client";

// ── verifyJwt ─────────────────────────────────────────────────────────────────
// Extracts, validates, and decodes the Bearer token from the Authorization header.
// On success, attaches a minimal { id, role } object to req.user and calls next().
// ─────────────────────────────────────────────────────────────────────────────
const verifyJwt = (req, res, next) => {

    // ── 1. Header presence ────────────────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header is missing.",
        });
    }

    // ── 2. Bearer scheme validation ───────────────────────────────────────────
    // Must start with exactly "Bearer " (case-sensitive, one space).
    // Rejecting non-Bearer schemes prevents token type confusion.
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization header must use the Bearer scheme.",
        });
    }

    // ── 3. Token extraction ───────────────────────────────────────────────────
    // slice(7) is safer than split(' ')[1]: handles extra spaces correctly.
    const token = authHeader.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Bearer token is missing.",
        });
    }

    // ── 4. JWT verification ───────────────────────────────────────────────────
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: [JWT_ALGORITHM], // Pin algorithm — prevents alg:none and RS256 confusion attacks
            issuer:     JWT_ISSUER,      // Must match the issuer set during signing
            audience:   JWT_AUDIENCE,    // Must match the audience set during signing
        });

        // ── 5. Attach only trusted, known fields to req.user ──────────────────
        // Never spread the full decoded payload onto req.user.
        // Only extract the fields the application explicitly trusts.
        // This prevents injected claims from propagating into authorization logic.
        req.user = {
            id:   decoded.sub,  // 'sub' is the standard JWT subject claim (user ID)
            role: decoded.role,
        };

        next();

    } catch (err) {

        // ── 6. Precise error discrimination ───────────────────────────────────
        // TokenExpiredError → 401 Unauthorized (re-authenticate)
        // JsonWebTokenError → 401 Unauthorized (malformed/invalid signature)
        // NotBeforeError    → 401 Unauthorized (token not yet valid)
        // Other             → 500 (unexpected — don't leak internals)

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please log in again.",
            });
        }

        if (
            err.name === "JsonWebTokenError" ||
            err.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        // Unexpected error — log it and return a generic 500
        console.error("[verifyJwt] Unexpected JWT error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

module.exports = verifyJwt;