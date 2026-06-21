const BaseFeedbackService = require('./BaseFeedback.service');
const { SUGGESTIONS } = require('../../constants/feedback.constants');

class RuleBasedFeedbackService extends BaseFeedbackService {
  /**
   * Generate feedback using advanced heuristics.
   * Scores: 0-100, higher is better.
   * Returns object with readabilityScore, clarityScore, and suggestions array.
   */
  async generateFeedback(content, category) {
    // --- Preprocess ---
    const trimmed = content.trim();
    if (!trimmed) {
      return {
        readabilityScore: 0,
        clarityScore: 0,
        suggestions: [
          'Your content is empty. Please write something meaningful.',
          'Add a clear topic and purpose to your text.',
          'Use examples and details to support your message.'
        ]
      };
    }

    // Split into sentences and words
    const sentenceRegex = /[^.!?]+[.!?]+/g;
    const sentences = trimmed.match(sentenceRegex) || [trimmed];
    const words = trimmed.match(/\b\w+\b/g) || [];
    const totalSentences = sentences.length;
    const totalWords = words.length;

    // --- Check for gibberish / placeholder text ---
    // Heuristic: if average word length is extremely high (e.g., > 10) or
    // the text contains only random characters (no common vowels or patterns),
    // we flag it as gibberish.
    let isGibberish = false;
    if (totalWords > 0) {
      const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / totalWords;
      // If average word length > 10, likely gibberish or random characters
      if (avgWordLen > 10) isGibberish = true;
      // Check for English-like character distribution (quick vowel check)
      const charCount = trimmed.replace(/\s/g, '').length;
      if (charCount > 0) {
        const vowelCount = (trimmed.match(/[aeiou]/gi) || []).length;
        const vowelRatio = vowelCount / charCount;
        // Very low vowel ratio indicates nonsensical text
        if (vowelRatio < 0.1 && charCount > 3) isGibberish = true;
      }
    }

    if (isGibberish) {
      return {
        readabilityScore: 10,
        clarityScore: 5,
        suggestions: [
          'Your text appears to be gibberish or placeholder content. Please replace it with actual, meaningful text.',
          'Define a clear purpose: what are you trying to communicate?',
          'Use real words and sentences that convey information.',
          'Consider breaking your content into logical sections with a clear introduction, body, and conclusion.'
        ].slice(0, 3) // ensure at least 3 suggestions
      };
    }

    // If extremely short (< 5 words), treat as insufficient content
    if (totalWords < 5) {
      return {
        readabilityScore: 20,
        clarityScore: 15,
        suggestions: [
          'Your content is too short (less than 5 words). Expand it to provide meaningful information.',
          'Add context: who is this for? What is the main message?',
          'Include specific details, examples, or benefits to make the content useful.'
        ]
      };
    }

    // --- Compute readability score (simplified Flesch Reading Ease) ---
    // Approximate syllables: average word length <= 5 => easy, >5 => harder
    const avgWordLength = totalWords > 0
      ? words.reduce((sum, w) => sum + w.length, 0) / totalWords
      : 0;
    const avgWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;

    // Base score starts at 100, penalize long sentences and long words
    let readability = 100;
    // Penalties for long sentences
    if (avgWordsPerSentence > 20) readability -= 20;
    else if (avgWordsPerSentence > 15) readability -= 10;
    else if (avgWordsPerSentence > 12) readability -= 5;
    // Penalties for long words
    if (avgWordLength > 6) readability -= 15;
    else if (avgWordLength > 5) readability -= 8;
    else if (avgWordLength > 4.5) readability -= 3;
    // Bonus for short sentences
    if (avgWordsPerSentence < 10) readability += 5;
    // Clamp
    readability = Math.min(100, Math.max(0, readability));

    // --- Compute clarity score ---
    let clarity = 80; // start high

    // 1. Passive voice detection (excessive passive indicates vagueness)
    const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
    const passiveMatches = trimmed.match(passiveRegex) || [];
    const passiveRatio = totalWords > 0 ? passiveMatches.length / totalWords : 0;
    if (passiveRatio > 0.05) clarity -= 25;
    else if (passiveRatio > 0.02) clarity -= 12;

    // 2. Sentence length variety (too uniform -> less engaging)
    if (totalSentences > 1) {
      const lengths = sentences.map(s => s.split(/\s+/).length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, l) => sum + (l - avg) ** 2, 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev < 1.5) clarity -= 10;
    }

    // 3. Overuse of complex words (avg word length > 5.5)
    if (avgWordLength > 5.5) clarity -= 10;

    // 4. Check for clear structure: presence of topic sentences or transition words
    const transitionWords = /\b(however|therefore|moreover|furthermore|in addition|for example|specifically|in conclusion|first|second|finally)\b/i;
    if (!transitionWords.test(trimmed)) {
      clarity -= 5;
    }

    clarity = Math.min(100, Math.max(0, clarity));

    // --- Generate Suggestions ---
    const suggestions = [];

    // Readability suggestions
    if (avgWordsPerSentence > 20) {
      suggestions.push('Shorten your sentences to improve readability. Aim for an average of 15-20 words per sentence.');
    } else if (avgWordsPerSentence > 15) {
      suggestions.push('Consider breaking up long sentences into shorter ones to enhance flow.');
    }
    if (avgWordLength > 6) {
      suggestions.push('Replace complex words with simpler alternatives to make your content more accessible.');
    }

    // Clarity suggestions
    if (passiveRatio > 0.05) {
      suggestions.push('Use active voice more often to make your writing clearer and more direct.');
    }
    if (totalSentences > 1 && clarity < 70) {
      suggestions.push('Vary your sentence length to keep the reader engaged.');
    }
    if (!transitionWords.test(trimmed)) {
      suggestions.push('Use transition words (e.g., "however", "therefore", "for example") to guide your reader through the argument.');
    }

    // Content quality suggestions
    if (!content.includes('benefit') && !content.includes('advantage') && !content.includes('value')) {
      suggestions.push('Add specific benefits or value propositions to make your content more persuasive.');
    }
    if (totalWords < 50) {
      suggestions.push('Expand your content with more details, examples, or supporting data.');
    }

    // Ensure at least 3 suggestions
    while (suggestions.length < 3) {
      suggestions.push('Consider structuring your content with a clear introduction, body, and conclusion.');
      if (suggestions.length < 3) {
        suggestions.push('Review your content for consistency and accuracy.');
      }
    }

    // Remove duplicates (if any) and limit to 5
    const uniqueSuggestions = [...new Set(suggestions)];
    const finalSuggestions = uniqueSuggestions.slice(0, 5);

    return {
      readabilityScore: Math.round(readability),
      clarityScore: Math.round(clarity),
      suggestions: finalSuggestions,
    };
  }
}

module.exports = RuleBasedFeedbackService;