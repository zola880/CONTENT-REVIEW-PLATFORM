const Joi = require('joi');
const { CATEGORIES } = require('../constants/app.constants');

// Schema for creating a new submission
// Content is optional because it can come from a file upload
// The controller will validate that either content or file is provided
const createSubmissionSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(0).max(10000).optional(), // Made optional for file uploads
  category: Joi.string().valid(...CATEGORIES).required(),
}).unknown(true); // Allows extra fields (like file metadata)

// Schema for previewing feedback – allows extra fields (like 'title') from the form
const previewFeedbackSchema = Joi.object({
  content: Joi.string().min(10).max(10000).required(),
  category: Joi.string().valid(...CATEGORIES).required(),
}).unknown(true); // allows additional fields (e.g., title) without error

// Schema for updating a submission title (rename)
const updateSubmissionSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
});

// Schema for regenerating feedback (no body needed)
const regenerateFeedbackSchema = Joi.object({});

module.exports = {
  createSubmissionSchema,
  previewFeedbackSchema,
  updateSubmissionSchema,
  regenerateFeedbackSchema,
};