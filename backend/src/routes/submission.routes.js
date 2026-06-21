// Routes for handling submission-related endpoints, including creating submissions, retrieving submissions, and regenerating feedback. All routes are protected by authentication middleware.
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createSubmissionSchema } = require('../validations/submission.validation');

// All routes require authentication
router.use(authMiddleware);

router.post('/', validate(createSubmissionSchema), submissionController.createSubmission);
router.get('/', submissionController.getSubmissions);
router.get('/:id', submissionController.getSubmissionById);
router.delete('/:id', submissionController.deleteSubmission);
router.patch('/:id', submissionController.updateSubmission);
router.post('/:id/regenerate-feedback', submissionController.regenerateFeedback);
router.post('/preview-feedback', submissionController.previewFeedback);


module.exports = router;