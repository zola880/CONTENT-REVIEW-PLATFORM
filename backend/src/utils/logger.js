// For production, consider winston or pino.
const logger = {
  info: (...args) => console.log(`[INFO] ${new Date().toISOString()}`, ...args),
  error: (...args) => console.error(`[ERROR] ${new Date().toISOString()}`, ...args),
  warn: (...args) => console.warn(`[WARN] ${new Date().toISOString()}`, ...args),
  debug: (...args) => console.debug(`[DEBUG] ${new Date().toISOString()}`, ...args),
};

module.exports = logger;
// Simple logger utility for the content review platform backend. Provides methods for logging informational messages, errors, warnings, and debug information with timestamps. In a production environment, consider using a more robust logging library like Winston or Pino for better performance and features such as log rotation and structured logging.