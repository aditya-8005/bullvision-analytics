const AppError = require("../errors/AppError");

/**
 * Global error handling middleware.
 */
const errorHandler = (err, req, res, next) => {

    // Known application errors
    if (err instanceof AppError) {

        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });

    }

    // Log unexpected errors
    console.error(err);

    // Generic response
    return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
    });

};

module.exports = errorHandler;