const app = require('./src/app');
const connectDB = require('./src/config/database');
const { port } = require('./src/config/env');
const logger = require('./src/utils/logger');

// Connect to MongoDB
connectDB();

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});