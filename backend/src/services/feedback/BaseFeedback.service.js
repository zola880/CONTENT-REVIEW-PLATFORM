class BaseFeedbackService {
  /**
   * Generate feedback for given content.
   * @param {string} content - The text content.
   * @param {string} category - The category of the content.
   * @returns {Promise<{ readabilityScore: number, clarityScore: number, suggestions: string[] }>}
   */
  async generateFeedback(content, category) {
    throw new Error('generateFeedback() must be implemented by subclass');
  }
}

module.exports = BaseFeedbackService;