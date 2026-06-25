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

  /**
   * Generate AI-powered feedback with title-aware analysis.
   * @param {string} content - The text content.
   * @param {string} category - The category of the content.
   * @param {string} title - The title of the submission.
   * @returns {Promise<{ readabilityScore: number, clarityScore: number, suggestions: string[] }>}
   */
  async generateFeedback(content, category, title) {
    // Count words
    const wordCount = content.trim().split(/\s+/).length;

    // If content is too short, skip AI
    if (wordCount < 5) {
      logger.info(`Content too short (${wordCount} words) – using rule‑based fallback.`);
      return this.fallbackService.generateFeedback(content, category, title);
    }

    // Prepare title context (if available)
    const titleContext = title && title.trim() ? `Title: "${title}"` : 'Title: Not provided';

    const systemPrompt = `
      You are an expert content quality analyst with deep experience in marketing, technical writing, and editorial review.
      Your task is to evaluate the given text critically and provide a structured, honest feedback report in JSON.

      ### Key Evaluation Dimensions:
      1. **Title-Content Alignment**: Does the content match the promise and theme of the title? Are key terms from the title addressed?
      2. **Professionalism**: Is the tone appropriate? Is the content well-structured? Is it free from informal or unprofessional language?
      3. **Readability**: How easy is the text to read? Consider sentence length, word choice, flow, and coherence.
      4. **Clarity**: Is the message clear and unambiguous? Is the purpose evident? Does it have a logical structure?

      ### Scoring Guidelines:
      - **readabilityScore** (0-100): 90+ = Excellent flow, 70-89 = Good, 50-69 = Fair, 0-49 = Needs improvement.
      - **clarityScore** (0-100): 90+ = Crystal clear, 70-89 = Mostly clear, 50-69 = Somewhat unclear, 0-49 = Confusing.
      - **suggestions**: Provide at least 3 concrete, actionable recommendations. Include *specific* advice on:
        - Title-content alignment (if they don't match)
        - Professionalism (tone, structure, formality)
        - Readability (sentence length, word choice)
        - Clarity (ambiguity, purpose, logical flow)

      ### Output Format:
      {
        "readabilityScore": number (0–100),
        "clarityScore": number (0–100),
        "suggestions": string[] (minimum 3)
      }

      **Return ONLY the JSON object, no extra text, no markdown.**
    `;

    const userPrompt = `
      ${titleContext}
      Category: ${category}
      Content:
      """${content}"""

      ### Instructions:
      1. **First, assess alignment**: Does the content directly address the title? Are the title's key terms present? If not, suggest how to bridge the gap.
      2. **Evaluate professionalism**: Is the tone consistent and professional? Is the content well-organized? Suggest improvements if needed.
      3. **Evaluate clarity and readability**: Are sentences too long? Are ideas clearly expressed? Provide specific fixes.
      4. **Be honest and critical**: If the content is placeholder, gibberish, or extremely vague, score it low (e.g., readability < 30, clarity < 20) and provide clear, actionable suggestions.
      5. **Ensure at least 3 suggestions** – they must be specific and directly tied to issues you observed.
      6. **Do not output any extra text – only JSON.**
    `;

    try {
      const response = await axios.post(
        groqApiUrl,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 700,
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
      return this.fallbackService.generateFeedback(content, category, title);
    }
  }
}

module.exports = GroqFeedbackService;