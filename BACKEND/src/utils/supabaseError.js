function throwIfSupabaseError(error, context) {
    if (!error) {
        return;
    }

    const wrappedError = new Error(`${context}: ${error.message}`);
    wrappedError.code = error.code;
    wrappedError.status = error.code === "23505" ? 409 : 500;
    throw wrappedError;
}

module.exports = { throwIfSupabaseError };
