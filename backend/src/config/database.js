const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { mongoUri } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;