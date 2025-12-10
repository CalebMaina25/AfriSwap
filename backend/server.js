const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.send(`<!doctype html><html><head><meta charset="utf-8"><title>AfriSwap Backend</title></head><body><h1>AfriSwap Backend</h1><p>Server is running.</p><ul><li><a href="/health">/health</a></li><li><a href="/api-docs">/api-docs</a></li></ul></body></html>`);
});

// Serve OpenAPI via Swagger UI if available
try {
  const swaggerUi = require('swagger-ui-express');
  const openapi = require('./openapi.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
} catch (err) {
  app.get('/api-docs', (req, res) => {
    res.send(`<!doctype html><html><head><meta charset="utf-8"><title>API Docs</title></head><body><h1>API (minimal)</h1><ul><li>GET /health</li><li>GET /api/auth</li><li>GET /api/trades</li><li>GET /api/wallet</li><li>GET /api/documents</li><li>GET /api/ai</li></ul></body></html>`);
  });
}

// API Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/trades', require('./src/routes/trade.routes'));
app.use('/api/wallet', require('./src/routes/wallet.routes'));
app.use('/api/documents', require('./src/routes/documents.routes'));
app.use('/api/ai', require('./src/routes/ai.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'SERVER_ERROR'
    }
  });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;