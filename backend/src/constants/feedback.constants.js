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
// This file defines constants used in the feedback generation process for the content review platform. It includes thresholds for categorizing readability and clarity scores into different levels (excellent, good, fair, poor) and a set of suggestion templates that can be used to provide actionable feedback to users based on the analysis of their content. These constants help standardize the feedback provided and make it easier to maintain and update the feedback logic in the future.