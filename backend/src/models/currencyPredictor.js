const { VertexAI } = require('@google-cloud/vertexai');

class CurrencyPredictor {
  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.VERTEX_AI_LOCATION
    });
    
    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-pro'
    });
  }

  async predictRate(fromCurrency, toCurrency, historicalData) {
    const prompt = `
      Predict exchange rate for ${fromCurrency} to ${toCurrency}.
      Historical data: ${JSON.stringify(historicalData)}
      Consider African market factors.
      Return JSON with predictedRate and confidence.
    `;
    
    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}

module.exports = CurrencyPredictor;
