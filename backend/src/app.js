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

// ============================================
// CORS CONFIGURATION
// ============================================

// Define allowed origins for production
const allowedOrigins = [
  'http://localhost:3000',                    // Local Vite dev
  'http://localhost:5000',                    // Local backend
  'https://task-managemet-six.vercel.app',    // Production frontend (without /login)
  process.env.FRONTEND_URL,                   // Fallback from environment variable
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200,
};

// Apply CORS middleware based on environment
if (nodeEnv === 'development') {
  // Development: permissive (allows any origin)
  app.use(cors());
  console.log(' CORS: Development mode (all origins allowed)');
} else {
  // Production: restricted to allowedOrigins
  app.use(cors(corsOptions));
  console.log(' CORS: Production mode (restricted origins)');
}

// ============================================
// SECURITY & PERFORMANCE MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// ============================================
// RATE LIMITING
// ============================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: ApiResponse.error('Too many requests, please try again later.', 429),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// ============================================
// BODY PARSERS


// Parse JSON bodies (limit: 10MB)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (limit: 10MB)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK ENDPOINT


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES


// Authentication routes (public)
app.use('/api/v1/auth', authRoutes);

// Submission routes (protected by JWT middleware inside routes)
app.use('/api/v1/submissions', submissionRoutes);



app.use((req, res, next) => {
  res.status(404).json(ApiResponse.error('Route not found', 404));
});


app.use(errorHandler);

module.exports = app;