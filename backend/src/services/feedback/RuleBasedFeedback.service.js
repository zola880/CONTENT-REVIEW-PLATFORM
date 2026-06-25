const BaseFeedbackService = require('./BaseFeedback.service');
const { SUGGESTIONS } = require('../../constants/feedback.constants');

// Simple stopwords list for keyword extraction
const STOPWORDS = new Set(['a', 'an', 'the', 'of', 'to', 'for', 'on', 'with', 'by', 'in', 'at', 'from', 'up', 'about', 'into', 'through', 'during', 'including', 'without', 'against', 'among', 'upon']);

class RuleBasedFeedbackService extends BaseFeedbackService {
  /**
   * Generate feedback using advanced heuristics, now considering title-content alignment.
   * Scores: 0-100, higher is better.
   * @param {string} content - The text content.
   * @param {string} category - The category of the content.
   * @param {string} title - The title of the submission.
   * @returns {Promise<{ readabilityScore: number, clarityScore: number, suggestions: string[] }>}
   */
  async generateFeedback(content, category, title) {
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

    // --- Gibberish detection ---
    let isGibberish = false;
    if (totalWords > 0) {
      const avgWordLen = words.reduce((sum, w) => sum + w.length, 0) / totalWords;
      if (avgWordLen > 10) isGibberish = true;
      const charCount = trimmed.replace(/\s/g, '').length;
      if (charCount > 0) {
        const vowelCount = (trimmed.match(/[aeiou]/gi) || []).length;
        const vowelRatio = vowelCount / charCount;
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
        ].slice(0, 3)
      };
    }

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

    // --- Readability score (simplified Flesch) ---
    const avgWordLength = totalWords > 0
      ? words.reduce((sum, w) => sum + w.length, 0) / totalWords
      : 0;
    const avgWordsPerSentence = totalSentences > 0 ? totalWords / totalSentences : 0;

    let readability = 100;
    if (avgWordsPerSentence > 20) readability -= 20;
    else if (avgWordsPerSentence > 15) readability -= 10;
    else if (avgWordsPerSentence > 12) readability -= 5;
    if (avgWordLength > 6) readability -= 15;
    else if (avgWordLength > 5) readability -= 8;
    else if (avgWordLength > 4.5) readability -= 3;
    if (avgWordsPerSentence < 10) readability += 5;
    readability = Math.min(100, Math.max(0, readability));

    // --- Clarity score ---
    let clarity = 80;

    // Passive voice
    const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
    const passiveMatches = trimmed.match(passiveRegex) || [];
    const passiveRatio = totalWords > 0 ? passiveMatches.length / totalWords : 0;
    if (passiveRatio > 0.05) clarity -= 25;
    else if (passiveRatio > 0.02) clarity -= 12;

    // Sentence variety
    if (totalSentences > 1) {
      const lengths = sentences.map(s => s.split(/\s+/).length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, l) => sum + (l - avg) ** 2, 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev < 1.5) clarity -= 10;
    }

    if (avgWordLength > 5.5) clarity -= 10;

    const transitionWords = /\b(however|therefore|moreover|furthermore|in addition|for example|specifically|in conclusion|first|second|finally)\b/i;
    if (!transitionWords.test(trimmed)) {
      clarity -= 5;
    }

    // --- Title-content alignment analysis ---
    let titleAlignmentScore = 100; // start high
    const titleKeywords = [];
    if (title && typeof title === 'string') {
      const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
      const contentLower = trimmed.toLowerCase();
      let matchedKeywords = 0;
      titleWords.forEach(kw => {
        if (contentLower.includes(kw)) matchedKeywords++;
      });
      const ratio = titleWords.length > 0 ? matchedKeywords / titleWords.length : 1;
      if (ratio === 0) {
        titleAlignmentScore -= 30;
      } else if (ratio < 0.3) {
        titleAlignmentScore -= 15;
      } else if (ratio < 0.6) {
        titleAlignmentScore -= 5;
      }
      // Check if title contains words like "benefit", "guide", "how to" and content misses them
      const titleHasGuide = /\b(guide|tutorial|how to|step|tips)\b/i.test(title);
      const contentHasGuide = /\b(guide|tutorial|how to|step|tips)\b/i.test(trimmed);
      if (titleHasGuide && !contentHasGuide) titleAlignmentScore -= 10;
    } else {
      // If title is missing, we cannot analyze alignment; skip.
    }

    // Combine title alignment into clarity (weighted lightly)
    if (titleAlignmentScore < 70) {
      clarity -= 10;
    } else if (titleAlignmentScore < 85) {
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

    // Title-alignment suggestions
    if (title && typeof title === 'string') {
      const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
      if (titleWords.length > 0) {
        const contentLower = trimmed.toLowerCase();
        const matched = titleWords.filter(kw => contentLower.includes(kw));
        if (matched.length === 0) {
          suggestions.push(`Your content does not mention any key terms from the title ("${title}"). Ensure your content directly addresses the topic promised by the title.`);
        } else if (matched.length < titleWords.length * 0.5) {
          suggestions.push(`Your content only partially covers the key terms in the title. Consider expanding on the main themes: ${titleWords.join(', ')}.`);
        }
        if (/\b(guide|tutorial|how to|step|tips)\b/i.test(title) && !/\b(guide|tutorial|how to|step|tips)\b/i.test(trimmed)) {
          suggestions.push('Your title suggests a guide or instructional content, but the body lacks clear steps or guidance. Add structured instructions to match the title.');
        }
      }
    } else {
      suggestions.push('Consider adding a clear, descriptive title to help readers understand the purpose of your content.');
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

    // Remove duplicates and limit to 5
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