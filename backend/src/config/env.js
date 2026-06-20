const dotenv = require('dotenv');
const Joi = require('joi');

// Load environment variables from .env file
dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  FEEDBACK_PROVIDER: Joi.string().valid('rule', 'groq').default('rule'),
  GROQ_API_KEY: Joi.string().when('FEEDBACK_PROVIDER', { is: 'groq', then: Joi.required() }),
  GROQ_API_URL: Joi.string().default('https://api.groq.com/openai/v1/chat/completions'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  mongoUri: envVars.MONGODB_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  feedbackProvider: envVars.FEEDBACK_PROVIDER,
  groqApiKey: envVars.GROQ_API_KEY,
  groqApiUrl: envVars.GROQ_API_URL,
};