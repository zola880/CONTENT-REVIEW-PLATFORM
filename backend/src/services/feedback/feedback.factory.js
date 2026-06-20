const RuleBasedFeedbackService = require('./RuleBasedFeedback.service');
const GroqFeedbackService = require('./GroqFeedback.service');
const { feedbackProvider } = require('../../config/env');

class FeedbackFactory {
  static getService() {
    if (feedbackProvider === 'groq') {
      return new GroqFeedbackService();
    }
    // default: rule-based
    return new RuleBasedFeedbackService();
  }
}

module.exports = FeedbackFactory;