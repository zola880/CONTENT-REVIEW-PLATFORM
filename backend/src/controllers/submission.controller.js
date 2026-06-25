const Submission = require('../models/Submission.model');
const FeedbackFactory = require('../services/feedback/feedback.factory');
const { ApiResponse } = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const { extractTextFromFile } = require('../utils/fileParser');

// ==================== GET Endpoints ====================

/**
 * Get all submissions for the authenticated user with pagination
 */
exports.getSubmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    const [submissions, total] = await Promise.all([
      Submission.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments({ user: userId }),
    ]);

    res.status(200).json(ApiResponse.paginated(submissions, page, limit, total));
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single submission by ID (check ownership)
 */
exports.getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const submission = await Submission.findOne({ _id: id, user: userId });
    if (!submission) {
      throw new AppError('Submission not found or access denied', 404);
    }
    res.status(200).json(ApiResponse.success(submission));
  } catch (error) {
    next(error);
  }
};

// ==================== POST / CREATE Endpoints ====================

/**
 * Create a new submission with feedback
 * Supports both text input and file upload
 */
exports.createSubmission = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, category } = req.body;
    let content = req.body.content;

    // If a file was uploaded, extract text from it
    if (req.file) {
      try {
        const extractedText = await extractTextFromFile(req.file);
        content = extractedText;
      } catch (error) {
        throw new AppError(`Failed to extract text from file: ${error.message}`, 400);
      }
    }

    // Validate required fields
    if (!title || !content || !category) {
      throw new AppError('Title, content, and category are required', 400);
    }

    // Generate feedback using the factory – now passing title
    const feedbackService = FeedbackFactory.getService();
    const feedback = await feedbackService.generateFeedback(content, category, title);

    // Build submission data
    const submissionData = {
      user: userId,
      title,
      content,
      category,
      feedback,
    };

    // If file was uploaded, add file metadata
    if (req.file) {
      submissionData.fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        encoding: req.file.encoding || 'utf-8',
      };
    }

    const submission = await Submission.create(submissionData);

    res.status(201).json(ApiResponse.success(submission, 'Submission created successfully', 201));
  } catch (error) {
    next(error);
  }
};

/**
 * Generate feedback preview without saving the submission
 * ✅ NOW SUPPORTS BOTH TEXT AND FILE UPLOADS and uses title
 */
exports.previewFeedback = async (req, res, next) => {
  try {
    let content = req.body.content;
    const { category, title } = req.body; // ✅ Get title from request body

    // If a file was uploaded, extract text from it
    if (req.file) {
      try {
        content = await extractTextFromFile(req.file);
      } catch (error) {
        throw new AppError(`Failed to extract text from file: ${error.message}`, 400);
      }
    }

    // Validate content and category
    if (!content || !category) {
      throw new AppError('Content and category are required', 400);
    }

    const feedbackService = FeedbackFactory.getService();
    // ✅ Pass title (may be undefined if not provided, but service handles it)
    const feedback = await feedbackService.generateFeedback(content, category, title);
    res.status(200).json(ApiResponse.success({ feedback }, 'Feedback preview generated'));
  } catch (error) {
    next(error);
  }
};

/**
 * Regenerate feedback for an existing submission
 */
exports.regenerateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findOne({ _id: id, user: userId });
    if (!submission) {
      throw new AppError('Submission not found or access denied', 404);
    }

    // Regenerate feedback – now passing title
    const feedbackService = FeedbackFactory.getService();
    const newFeedback = await feedbackService.generateFeedback(
      submission.content,
      submission.category,
      submission.title // ✅ Pass the submission's title
    );

    // Update submission with new feedback
    submission.feedback = newFeedback;
    await submission.save();

    res.status(200).json(ApiResponse.success({ feedback: newFeedback }, 'Feedback regenerated successfully'));
  } catch (error) {
    next(error);
  }
};

// ==================== PATCH / UPDATE Endpoints ====================

/**
 * Update submission title (rename)
 */
exports.updateSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || title.trim().length < 3) {
      throw new AppError('Title must be at least 3 characters', 400);
    }

    const submission = await Submission.findOne({ _id: id, user: userId });
    if (!submission) {
      throw new AppError('Submission not found or access denied', 404);
    }

    submission.title = title.trim();
    await submission.save();

    res.status(200).json(ApiResponse.success(submission, 'Submission updated successfully'));
  } catch (error) {
    next(error);
  }
};

// ==================== DELETE Endpoints ====================

/**
 * Delete a single submission
 */
exports.deleteSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findOne({ _id: id, user: userId });
    if (!submission) {
      throw new AppError('Submission not found or access denied', 404);
    }

    await Submission.deleteOne({ _id: id });
    res.status(200).json(ApiResponse.success(null, 'Submission deleted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all submissions for the authenticated user
 */
exports.deleteAllSubmissions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await Submission.deleteMany({ user: userId });
    res.status(200).json(ApiResponse.success(
      { deletedCount: result.deletedCount },
      'All submissions deleted successfully'
    ));
  } catch (error) {
    next(error);
  }
};