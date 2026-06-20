const Joi = require('joi');
const { CATEGORIES } = require('../constants/app.constants');

const createSubmissionSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).max(10000).required(),
  category: Joi.string().valid(...CATEGORIES).required(),
});

const regenerateFeedbackSchema = Joi.object({
  // No body needed, just submission ID in params
});

module.exports = {
  createSubmissionSchema,
  regenerateFeedbackSchema,
};// Validation schemas for submission-related routes, including creating a new submission and regenerating feedback. Uses Joi to define the expected structure and constraints for incoming request data, ensuring that title, content, and category fields meet the required criteria before processing the request further.