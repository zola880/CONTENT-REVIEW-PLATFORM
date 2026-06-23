// Mongoose model for user submissions, including feedback structure, indexing, and file metadata
const mongoose = require('mongoose');
const { CATEGORIES } = require('../constants/app.constants');

// Feedback schema (embedded)
const feedbackSchema = new mongoose.Schema({
  readabilityScore: { type: Number, min: 0, max: 100 },
  clarityScore: { type: Number, min: 0, max: 100 },
  suggestions: { type: [String], default: [] },
}, { _id: false });

// File information schema (embedded)
const fileInfoSchema = new mongoose.Schema({
  filename: { type: String, required: true },          // Saved filename (e.g., "uuid.txt")
  originalName: { type: String, required: true },      // Original user-provided filename
  fileSize: { type: Number, required: true },          // Size in bytes
  fileType: { type: String, required: true },          // MIME type (e.g., "text/plain")
  encoding: { type: String, default: 'utf-8' },        // Optional encoding info
}, { _id: false });

// Submission schema
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
  // New: file metadata (optional, only present if user uploaded a file)
  fileInfo: {
    type: fileInfoSchema,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient user queries sorted by date
submissionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);