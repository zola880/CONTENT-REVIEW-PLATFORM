const app = require('./src/app');
const connectDB = require('./src/config/database');
const { port, nodeEnv } = require('./src/config/env');
const logger = require('./src/utils/logger');

// Connect to MongoDB
connectDB();

const server = app.listen(port, () => {
  logger.info(` Server running on port ${port} in ${nodeEnv} mode`);  
});



// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(' UNHANDLED REJECTION! Shutting down...');
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(' UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.stack);
  process.exit(1);
});

// ----- Graceful Shutdown -----
process.on('SIGTERM', () => {
  logger.info(' SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    logger.info(' HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info(' SIGINT signal received: closing HTTP server gracefully');
  server.close(() => {
    logger.info(' HTTP server closed');
    process.exit(0);
  });
});