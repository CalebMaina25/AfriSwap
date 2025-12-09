const { defineFlow } = require('@genkit-ai/core');
const { vertexAI } = require('@genkit-ai/vertexai');

exports.tradeAssistant = defineFlow({
  name: 'tradeAssistant',
  inputSchema: {
    question: { type: 'string' },
    context: { 
      type: 'object',
      properties: {
        userId: { type: 'string' },
        country: { type: 'string' }
      }
    }
  },
  outputSchema: {
    answer: { type: 'string' },
    suggestions: { type: 'array', items: { type: 'string' } }
  },
  async run({ question, context }) {
    // Use Vertex AI for response
    const response = await vertexAI.generate({
      prompt: `As a cross-border trade expert for Africa, answer: ${question}`,
      context: `User from ${context.country}`
    });
    
    return {
      answer: response.text,
      suggestions: extractSuggestions(response)
    };
  }
});
