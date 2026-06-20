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
};