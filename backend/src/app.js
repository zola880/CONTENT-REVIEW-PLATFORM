const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const submissionRoutes = require('./routes/submission.routes');
const errorHandler = require('./middleware/error.middleware');
const { ApiResponse } = require('./utils/ApiResponse');
const { nodeEnv } = require('./config/env');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting on all requests (optional)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: ApiResponse.error('Too many requests, please try again later.', 429),
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: nodeEnv });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/submissions', submissionRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json(ApiResponse.error('Route not found', 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;