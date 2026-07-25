const { generateSession } = require("../market/services/angelOneAuthService");

/**
 * Cached Angel One session.
 *
 * Structure:
 * {
 *   jwtToken: string,
 *   refreshToken: string,
 *   feedToken: string,
 * }
 */
let session = null;

/**
 * Promise used to prevent multiple concurrent logins.
 *
 * Example:
 * If 10 requests arrive simultaneously and no session exists,
 * only the first request will generate a new session.
 * The remaining requests will wait for the same promise.
 */
let sessionPromise = null;

/**
 * Returns the cached session.
 *
 * @returns {Object|null}
 */
const getSession = () => {
    return session;
};

/**
 * Returns true if a session exists.
 *
 * @returns {boolean}
 */
const hasSession = () => {
    return session !== null;
};

/**
 * Clears the cached session.
 */
const clearSession = () => {
    console.log("🗑️ Clearing cached Angel One session...");
    session = null;
    sessionPromise = null;
};

/**
 * Returns a valid JWT token.
 *
 * If a session already exists, reuse it.
 * If another request is already generating a session,
 * wait for that session instead of generating another.
 *
 * @returns {Promise<string>}
 */
const getAuthToken = async () => {

    // Reuse existing session
    if (session?.jwtToken) {
        return session.jwtToken;
    }

    // Another request is already logging in
    if (sessionPromise) {
        console.log("⏳ Waiting for existing Angel One session...");
        await sessionPromise;
        return session.jwtToken;
    }

    console.log("🔐 Generating new Angel One session...");

    sessionPromise = generateSession();

    try {

        session = await sessionPromise;

        console.log("✅ Angel One session created successfully.");

        return session.jwtToken;

    } catch (error) {

        console.error("❌ Failed to create Angel One session.");
        console.error(error);

        session = null;

        throw error;

    } finally {

        sessionPromise = null;

    }
};

module.exports = {
    getAuthToken,
    getSession,
    clearSession,
    hasSession,
};