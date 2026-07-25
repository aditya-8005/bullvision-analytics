const { createClient } = require("@supabase/supabase-js");

const requiredEnvironmentVariables = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
];

function assertSupabaseConfiguration() {
    const missing = requiredEnvironmentVariables.filter(
        name => !process.env[name]
    );

    if (missing.length) {
        throw new Error(
            `Missing required Supabase environment variables: ${missing.join(", ")}`
        );
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // New Supabase keys are opaque (`sb_secret_...`); legacy keys are JWTs.
    // Explicitly reject publishable keys and legacy anon JWTs before a request
    // reaches PostgREST and fails under RLS.
    if (serviceRoleKey.startsWith("sb_publishable_")) {
        throw new Error(
            "SUPABASE_SERVICE_ROLE_KEY contains a publishable key. Use the server-only secret key from Supabase project API settings."
        );
    }

    if (serviceRoleKey.startsWith("eyJ")) {
        try {
            const payload = JSON.parse(
                Buffer.from(serviceRoleKey.split(".")[1], "base64url").toString("utf8")
            );

            if (payload.role !== "service_role") {
                throw new Error(
                    "SUPABASE_SERVICE_ROLE_KEY must contain a legacy service_role JWT, not an anon key."
                );
            }
        } catch (error) {
            if (error.message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
                throw error;
            }

            throw new Error(
                "SUPABASE_SERVICE_ROLE_KEY is not a valid Supabase service-role JWT."
            );
        }
    }
}

function createSupabaseClient() {
    assertSupabaseConfiguration();

    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

const supabase = createSupabaseClient();

async function verifyDatabaseConnection() {
    const { error } = await supabase
        .from("users")
        .select("id", { head: true, count: "exact" })
        .limit(1);

    if (error) {
        throw new Error(`Supabase connection failed: ${error.message}`);
    }
}

module.exports = {
    supabase,
    verifyDatabaseConnection,
};
