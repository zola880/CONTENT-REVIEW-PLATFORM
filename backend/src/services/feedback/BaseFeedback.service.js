/**
 * BaseFeedbackService.js - Abstract class for feedback generation services.
 * Defines the interface for generating feedback based on content, category, and title.
 * Subclasses must implement the generateFeedback method to provide specific feedback logic.
 */
class BaseFeedbackService {
  /**
   * Generate feedback for given content.
   * @param {string} content - The text content to analyze.
   * @param {string} category - The category of the content (e.g., Marketing, Technical, General).
   * @param {string} title - The title of the submission.
   * @returns {Promise<{ readabilityScore: number, clarityScore: number, suggestions: string[] }>}
   */
  async generateFeedback(content, category, title) {
    throw new Error('generateFeedback() must be implemented by subclass');
  }
}

module.exports = BaseFeedbackService;