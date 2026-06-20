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
// Factory class for creating instances of feedback services based on the configured provider. It checks the environment variable to determine which feedback service to use (either Groq or rule-based) and returns an instance of the appropriate service. This allows for flexibility in switching between different feedback generation mechanisms without changing the core logic of the application, making it easier to maintain and extend in the future.