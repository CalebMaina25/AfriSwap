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

// Root route: short welcome and links
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>AfriSwap API</title></head>
      <body style="font-family: sans-serif; line-height:1.6;">
        <h1>AfriSwap Backend</h1>
        <p>Server is running. Useful endpoints:</p>
        <ul>
          <li><a href="/health">/health</a> — health check</li>
          <li><a href="/api-docs">/api-docs</a> — API information</li>
          <li><a href="/api/auth">/api/auth</a> — auth routes</li>
        </ul>
      </body>
    </html>
  `);
});

// Minimal API docs page
app.get('/api-docs', (req, res) => {
  res.send(`
    <html>
      <head><title>AfriSwap API Docs</title></head>
      <body style="font-family: sans-serif;">
        <h1>AfriSwap — API Docs (minimal)</h1>
        <p>This is a minimal documentation page. Replace with real Swagger/OpenAPI UI.</p>
        <ul>
          <li>GET /health</li>
          <li>GET /api/auth</li>
          <li>GET /api/trades</li>
          <li>GET /api/wallet</li>
          <li>GET /api/documents</li>
          <li>GET /api/ai</li>
        </ul>
      </body>
    </html>
  `);
});

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});