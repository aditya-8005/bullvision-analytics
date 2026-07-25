const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");
const { throwIfSupabaseError } = require("../utils/supabaseError");

// ===============================
// JWT Configuration
// ===============================
const JWT_ALGORITHM = "HS256";
const JWT_EXPIRES_IN = "15m";
const JWT_ISSUER = "bullvision-api";
const JWT_AUDIENCE = "bullvision-client";

// ===============================
// Helper: Strip password_hash before sending user to client
// ===============================
function toPublicUser(user) {
    const { password_hash, ...publicUser } = user;
    return publicUser;
}

// ===============================
// Register User
// ===============================
const registerUser = async (userData) => {

    // Email is already trimmed and lowercased by Zod
    const email = userData.email;

    const { data: existingUser, error: lookupError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
    throwIfSupabaseError(lookupError, "Could not check existing user");

    if (existingUser) {
        throw new Error("Email already exists try with new email.");
    }

    const passwordHash = await bcrypt.hash(userData.password, 12);

    const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({ name: userData.name.trim(), email, password_hash: passwordHash })
        .select("id, name, email, role, is_active, created_at, updated_at")
        .single();
    throwIfSupabaseError(insertError, "Could not create user");

    return newUser;
};

// ===============================
// Login User
// ===============================
const loginUser = async (userData) => {

    // Email is already trimmed and lowercased by Zod
    const email = userData.email;

    const { data: existingUser, error } = await supabase
        .from("users")
        .select("id, name, email, password_hash, role, is_active, created_at, updated_at")
        .eq("email", email)
        .maybeSingle();
    throwIfSupabaseError(error, "Could not load user");

    // ── Timing-attack defence ──────────────────────────────────────────────
    // Always run bcrypt.compare, even when no user is found.
    // This ensures the response time is identical whether the email exists
    // or not, preventing user enumeration via timing side-channels.
    // ──────────────────────────────────────────────────────────────────────
    const DUMMY_HASH = "$2b$12$invalidhashplaceholderthatwillalwaysfailXXXXXXXXXXXXXXX";
    const candidateHash = existingUser ? existingUser.password_hash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(userData.password, candidateHash);

    if (!existingUser || !isMatch) {
        throw new Error("Invalid email or password.");
    }

    if (!existingUser.is_active) {
        throw new Error("This account is inactive.");
    }

    // ── JWT: minimal payload ───────────────────────────────────────────────
    // Only include what downstream code actually needs: id and role.
    // Email is intentionally excluded — it is PII and not required for
    // any authorization decision. The token is signed (not encrypted),
    // so any field in the payload is readable by the token holder.
    // ──────────────────────────────────────────────────────────────────────
    const token = jwt.sign(
        {
            sub: existingUser.id,    // Subject  — standard JWT claim for user identity
            role: existingUser.role, // Role     — needed for future authorization checks
        },
        process.env.JWT_SECRET,
        {
            algorithm:  JWT_ALGORITHM,  // Pin HS256 — prevents algorithm confusion attacks
            expiresIn:  JWT_EXPIRES_IN, // 15 minutes — short-lived token
            issuer:     JWT_ISSUER,     // Validated on verify — prevents cross-service token reuse
            audience:   JWT_AUDIENCE,   // Validated on verify — prevents token misuse
        }
    );

    return {
        user: toPublicUser(existingUser),
        accessToken: token,
        expiresIn: JWT_EXPIRES_IN,
    };
};

module.exports = {
    registerUser,
    loginUser,
};
