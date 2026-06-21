const axios = require('axios');
const BaseFeedbackService = require('./BaseFeedback.service');
const RuleBasedFeedbackService = require('./RuleBasedFeedback.service');
const { groqApiKey, groqApiUrl } = require('../../config/env');
const logger = require('../../utils/logger');

class GroqFeedbackService extends BaseFeedbackService {
  constructor() {
    super();
    this.fallbackService = new RuleBasedFeedbackService();
  }

  async generateFeedback(content, category) {
    // Count words
    const wordCount = content.trim().split(/\s+/).length;

    // If content is too short, skip AI
    if (wordCount < 5) {
      logger.info(`Content too short (${wordCount} words) – using rule‑based fallback.`);
      return this.fallbackService.generateFeedback(content, category);
    }

    const systemPrompt = `
      You are an expert content quality analyst with deep experience in marketing, technical writing, and editorial review.
      Your task is to evaluate the given text critically and provide a structured, honest feedback report in JSON.

      ### Evaluation Criteria:
      - **Readability**: How easy is the text to read? Consider sentence length, word choice, flow, and coherence. Lower scores for rambling, convoluted, or nonsensical text.
      - **Clarity**: Is the message clear and unambiguous? Is the purpose evident? Does it have a logical structure? Low clarity if the text is vague, confusing, or lacks direction.
      - **Suggestions**: Provide at least 3 concrete, actionable recommendations to improve the content. They must be *specific to the content* – not generic. If the content is placeholder or gibberish, suggest adding meaningful information, defining a clear objective, providing examples, structuring the text, etc.

      ### Output Format:
      {
        "readabilityScore": number (0–100),
        "clarityScore": number (0–100),
        "suggestions": string[] (minimum 3)
      }

      **Return ONLY the JSON object, no extra text, no markdown.**
    `;

    const userPrompt = `
      Category: ${category}
      Content:
      """${content}"""

      ### Instructions:
      1. Read the content carefully.
      2. Assess its quality honestly – if it's placeholder text, gibberish, or extremely vague, score it low (e.g., readability < 40, clarity < 30) and suggest concrete improvements like: "Replace placeholder with actual content describing the product/service.", "Add a clear objective for this text.", "Structure the content with a clear introduction, body, and conclusion."
      3. Ensure suggestions are directly tied to issues you observed.
      4. Do not output any extra text – only JSON.
    `;

    try {
      const response = await axios.post(
        groqApiUrl,
        {
          // ✅ UPDATED TO SUPPORTED MODEL
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 600,
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      let raw = response.data.choices[0].message.content.trim();
      logger.debug('Groq raw response:', raw);

      let feedback;
      try {
        feedback = JSON.parse(raw);
      } catch (e) {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          feedback = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON');
        }
      }

      // Validate and sanitise
      if (typeof feedback.readabilityScore !== 'number') {
        throw new Error('Missing readabilityScore');
      }
      if (typeof feedback.clarityScore !== 'number') {
        throw new Error('Missing clarityScore');
      }
      if (!Array.isArray(feedback.suggestions) || feedback.suggestions.length < 1) {
        throw new Error('Missing or insufficient suggestions');
      }

      feedback.readabilityScore = Math.min(100, Math.max(0, Math.round(feedback.readabilityScore)));
      feedback.clarityScore = Math.min(100, Math.max(0, Math.round(feedback.clarityScore)));

      if (feedback.suggestions.length < 3) {
        feedback.suggestions = [
          ...feedback.suggestions,
          'Consider breaking long paragraphs into shorter ones.',
          'Add more examples to illustrate your points.'
        ].slice(0, 3);
      }

      return feedback;
    } catch (error) {
      if (error.response) {
        logger.error('Groq API error:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else {
        logger.error('Groq request error:', error.message);
      }

      logger.warn('Falling back to rule‑based feedback due to Groq error');
      return this.fallbackService.generateFeedback(content, category);
    }
  }
}

module.exports = GroqFeedbackService;