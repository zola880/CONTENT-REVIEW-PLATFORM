class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
// Custom error class for handling application-specific errors in the content review platform backend. Extends the built-in Error class and includes additional properties such as statusCode and isOperational to differentiate between operational errors (e.g., invalid input, authentication failures) and programming errors. This class can be used