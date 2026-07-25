const AppError = require("./AppError");

class ExternalServiceError extends AppError {

    constructor(message = "External service unavailable.") {

        super(message, 502);

    }

}

module.exports = ExternalServiceError;