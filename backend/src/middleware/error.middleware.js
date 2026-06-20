const { ApiResponse } = require('../utils/ApiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  // In production, don't expose stack traces
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    return res.status(500).json(ApiResponse.error('Internal Server Error', 500));
  }

  res.status(statusCode).json(ApiResponse.error(message, statusCode, err.stack));
};

module.exports = errorHandler;