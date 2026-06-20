const BaseFeedbackService = require('./BaseFeedback.service');
const { SUGGESTIONS } = require('../../constants/feedback.constants');

class RuleBasedFeedbackService extends BaseFeedbackService {
  async generateFeedback(content, category) {
    // Simple readability: average sentence length and average word length
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    const words = content.match(/\b\w+\b/g) || [];
    const totalSentences = sentences.length;
    const totalWords = words.length;

    // Average word length (characters)
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const avgWordLength = totalWords > 0 ? totalChars / totalWords : 0;
    // Average words per sentence
    const avgWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;

    // Approximate readability score (0-100): longer sentences/words lower score
    let readability = 100;
    if (avgWordsPerSentence > 20) readability -= 15;
    else if (avgWordsPerSentence > 15) readability -= 8;
    if (avgWordLength > 6) readability -= 10;
    else if (avgWordLength > 5) readability -= 5;
    // Bonus for short sentences
    if (avgWordsPerSentence < 10) readability += 5;
    readability = Math.min(100, Math.max(0, readability));

    // Clarity: detect passive voice (simple regex: "be" + past participle) and sentence variety
    let clarity = 80; // start high
    const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
    const passiveMatches = content.match(passiveRegex) || [];
    const passiveRatio = totalWords > 0 ? passiveMatches.length / totalWords : 0;
    if (passiveRatio > 0.05) clarity -= 20;
    else if (passiveRatio > 0.02) clarity -= 10;
    // Sentence variety: standard deviation of sentence lengths (simplified)
    if (totalSentences > 1) {
      const lengths = sentences.map(s => s.split(/\s+/).length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, l) => sum + (l - avg) ** 2, 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev < 2) clarity -= 10;
    }
    clarity = Math.min(100, Math.max(0, clarity));

    // Suggestions based on rules
    const suggestions = [];
    if (avgWordsPerSentence > 20) {
      suggestions.push(SUGGESTIONS.SHORTEN_SENTENCES);
    }
    if (passiveRatio > 0.05) {
      suggestions.push(SUGGESTIONS.REDUCE_PASSIVE);
    }
    if (!content.includes('benefit') && !content.includes('advantage') && !content.includes('value')) {
      suggestions.push(SUGGESTIONS.ADD_SPECIFICS);
    }
    if (avgWordLength > 6) {
      suggestions.push(SUGGESTIONS.SIMPLIFY_WORDS);
    }
    if (totalSentences > 1 && suggestions.length === 0) {
      suggestions.push(SUGGESTIONS.VARY_SENTENCE_LENGTH);
    }
    // Ensure at least one suggestion
    if (suggestions.length === 0) {
      suggestions.push('Consider adding more specific examples to strengthen the content.');
    }

    return {
      readabilityScore: Math.round(readability),
      clarityScore: Math.round(clarity),
      suggestions,
    };
  }
}

module.exports = RuleBasedFeedbackService;
// This service provides a rule-based feedback mechanism for evaluating the readability and clarity of user-submitted content. It calculates scores based on average sentence length, average word length, and the presence of passive voice. It also generates suggestions for improvement based on these metrics. This is a fallback mechanism in case the AI-based feedback generation fails, ensuring that users still receive valuable insights on their submissions.