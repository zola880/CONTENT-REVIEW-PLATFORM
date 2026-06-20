const axios = require('axios');
const BaseFeedbackService = require('./BaseFeedback.service');
const { groqApiKey, groqApiUrl } = require('../../config/env');
const AppError = require('../../utils/AppError');

class GroqFeedbackService extends BaseFeedbackService {
  async generateFeedback(content, category) {
    const prompt = `
      Analyze the following content and provide a feedback object in valid JSON format.
      The object must have: readabilityScore (0-100), clarityScore (0-100), and suggestions (array of strings, at least 3).
      Content category: ${category}
      Content: """${content}"""
      Return only JSON, no extra text.
    `;

    try {
      const response = await axios.post(
        groqApiUrl,
        {
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const raw = response.data.choices[0].message.content;
      // Try to parse JSON
      let feedback;
      try {
        feedback = JSON.parse(raw);
      } catch (parseError) {
        // Fallback: attempt to extract JSON from text
        const jsonMatch = raw.match(/\{.*\}/s);
        if (jsonMatch) {
          feedback = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('AI response did not contain valid JSON');
        }
      }

      // Validate structure
      if (typeof feedback.readabilityScore !== 'number' ||
          typeof feedback.clarityScore !== 'number' ||
          !Array.isArray(feedback.suggestions)) {
        throw new Error('AI response missing required fields');
      }

      // Clamp scores
      feedback.readabilityScore = Math.min(100, Math.max(0, feedback.readabilityScore));
      feedback.clarityScore = Math.min(100, Math.max(0, feedback.clarityScore));

      return feedback;
    } catch (error) {
      // Fallback to rule-based if AI fails? Or throw error.
      // For this assignment, we throw a clear error.
      throw new AppError(`Groq API error: ${error.message}`, 503);
    }
  }
}

module.exports = GroqFeedbackService;