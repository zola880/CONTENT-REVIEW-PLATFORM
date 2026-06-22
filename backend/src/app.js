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

// ----- CORS Configuration -----
// Allow specific origins for production, fallback to all for development
const allowedOrigins = [
  'http://localhost:3000',      // local Vite dev
  'http://localhost:5000',      // local backend (if needed)
  process.env.FRONTEND_URL,     // e.g., https://content-review.vercel.app
].filter(Boolean); // remove undefined

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies/auth headers
  optionsSuccessStatus: 200,
};

// In development, we can be more permissive
if (nodeEnv === 'development') {
  app.use(cors());
} else {
  app.use(cors(corsOptions));
}

// ----- Security & Performance -----
app.use(helmet());
app.use(compression());

// Rate limiting on all requests
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