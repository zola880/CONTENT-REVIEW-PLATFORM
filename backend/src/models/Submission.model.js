const mongoose = require('mongoose');
const { CATEGORIES } = require('../constants/app.constants');

const feedbackSchema = new mongoose.Schema({
  readabilityScore: { type: Number, min: 0, max: 100 },
  clarityScore: { type: Number, min: 0, max: 100 },
  suggestions: { type: [String], default: [] },
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: 10,
    maxlength: 10000,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: CATEGORIES,
  },
  feedback: feedbackSchema,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient user queries sorted by date
submissionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);