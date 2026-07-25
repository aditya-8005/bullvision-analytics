const authService = require("../services/authService");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {

    // req.body is already validated and sanitized by the Zod middleware.
    // name, email, password are guaranteed present and within bounds.
    const { name, email, password } = req.body;

    try {
        await authService.registerUser({ name, email, password });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });

    } catch (error) {

        if (error.message === "Email already exists try with new email.") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        console.error("[registerUser]", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {

    // req.body is already validated and sanitized by the Zod middleware.
    const { email, password } = req.body;

    try {
        const data = await authService.loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
            user: data.user,
        });

    } catch (error) {

        // Both "wrong email" and "wrong password" map to the same 401 message.
        // This is intentional — prevents user enumeration.
        if (
            error.message === "Invalid email or password." ||
            error.message === "This account is inactive."
        ) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        console.error("[loginUser]", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

// ===============================
// Profile User
// ===============================
const profileUser = (req, res) => {
    // req.user is set by verifyJwt and contains only { id, role }.
    return res.status(200).json({
        success: true,
        user: req.user,
    });
};

// ===============================
// Logout User
// ===============================
// V1 DESIGN NOTE:
// This backend uses stateless JWTs. The server issues a token and has
// no mechanism to invalidate it before its natural expiry (15 minutes).
//
// Logout here is "client-side logout" — the client is instructed to
// delete the token from its storage (localStorage, memory, etc.).
//
// Why this is acceptable for V1:
//   • The access token expires in 15 minutes automatically.
//   • verifyJwt is now required on /logout, so only authenticated
//     users reach this endpoint — future blacklisting logic lands here.
//   • The architecture is forward-compatible: a token blacklist or
//     refresh token revocation table can be added to this handler
//     without changing any other files.
//
// Limitation:
//   • A stolen token remains valid until it expires naturally (max 15m).
//   • Full revocation requires a server-side blacklist (Redis/Supabase).
// ─────────────────────────────────────────────────────────────────────
const logoutUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logged out successfully. Please delete your token on the client.",
    });
};

module.exports = {
    registerUser,
    loginUser,
    profileUser,
    logoutUser,
};
