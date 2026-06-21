const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createSubmissionSchema } = require('../validations/submission.validation');

router.use(authMiddleware);

// ✅ Delete all submissions – must come BEFORE /:id
router.delete('/all', submissionController.deleteAllSubmissions);

router.post('/', validate(createSubmissionSchema), submissionController.createSubmission);
router.get('/', submissionController.getSubmissions);
router.get('/:id', submissionController.getSubmissionById);
router.post('/:id/regenerate-feedback', submissionController.regenerateFeedback);
router.delete('/:id', submissionController.deleteSubmission);
router.patch('/:id', submissionController.updateSubmission);
// preview-feedback route (if you have it) should also be before /:id
// router.post('/preview-feedback', submissionController.previewFeedback);

module.exports = router;