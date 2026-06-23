const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const upload = require('../middleware/upload.middleware');
const { 
  createSubmissionSchema, 
  previewFeedbackSchema, 
  updateSubmissionSchema 
} = require('../validations/submission.validation');

// All routes require authentication
router.use(authMiddleware);

// ✅ Preview feedback – NOW SUPPORTS FILE UPLOADS with multer
// Must come before /:id routes
router.post(
  '/preview-feedback',
  upload.single('file'),
  validate(previewFeedbackSchema),
  submissionController.previewFeedback
);

// Delete all submissions – must come before /:id
router.delete('/all', submissionController.deleteAllSubmissions);

// Standard CRUD routes with :id parameters
router.post('/', upload.single('file'), validate(createSubmissionSchema), submissionController.createSubmission);
router.get('/', submissionController.getSubmissions);
router.get('/:id', submissionController.getSubmissionById);
router.post('/:id/regenerate-feedback', submissionController.regenerateFeedback);
router.delete('/:id', submissionController.deleteSubmission);
router.patch('/:id', validate(updateSubmissionSchema), submissionController.updateSubmission);

module.exports = router;