// Rule-based thresholds
const READABILITY_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 20,
};

const CLARITY_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 20,
};

// Suggestion templates
const SUGGESTIONS = {
  SHORTEN_SENTENCES: 'Use shorter sentences to improve readability.',
  REDUCE_PASSIVE: 'Avoid passive voice for better clarity.',
  ADD_SPECIFICS: 'Include specific product benefits or data points.',
  VARY_SENTENCE_LENGTH: 'Vary sentence length to improve flow.',
  SIMPLIFY_WORDS: 'Replace complex words with simpler alternatives.',
};

module.exports = {
  READABILITY_THRESHOLDS,
  CLARITY_THRESHOLDS,
  SUGGESTIONS,
};