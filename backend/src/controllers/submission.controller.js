const Submission = require('../models/Submission.model');
const FeedbackFactory = require('../services/feedback/feedback.factory');
const { ApiResponse } = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

// Get all submissions for the authenticated user with pagination
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

// Get a single submission by ID (check ownership)
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

// Create a new submission with feedback
exports.createSubmission = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.id;

    // Generate feedback using the factory
    const feedbackService = FeedbackFactory.getService();
    const feedback = await feedbackService.generateFeedback(content, category);

    const submission = await Submission.create({
      user: userId,
      title,
      content,
      category,
      feedback,
    });

    res.status(201).json(ApiResponse.success(submission, 'Submission created successfully', 201));
  } catch (error) {
    next(error);
  }
};

// Regenerate feedback for an existing submission
exports.regenerateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findOne({ _id: id, user: userId });
    if (!submission) {
      throw new AppError('Submission not found or access denied', 404);
    }

    // Regenerate feedback
    const feedbackService = FeedbackFactory.getService();
    const newFeedback = await feedbackService.generateFeedback(submission.content, submission.category);

    // Update submission with new feedback
    submission.feedback = newFeedback;
    await submission.save();

    res.status(200).json(ApiResponse.success({ feedback: newFeedback }, 'Feedback regenerated successfully'));
  } catch (error) {
    next(error);
  }
};