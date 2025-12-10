const express = require('express');
const { db } = require('../config/firebase');

const router = express.Router();

// In-memory storage for demo (replace with database)
let trades = [];
let tradeIdCounter = 1;

/**
 * GET /api/trades
 * List all trades
 */
router.get('/', async (req, res, next) => {
  try {
    const { userId, status } = req.query;
    let filtered = trades;

    if (userId) filtered = filtered.filter(t => t.userId === userId);
    if (status) filtered = filtered.filter(t => t.status === status);

    res.json({
      message: 'Trades',
      count: filtered.length,
      trades: filtered
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/trades
 * Create a new trade
 */
router.post('/', async (req, res, next) => {
  try {
    const { userId, fromCurrency, toCurrency, amount, exchangeRate } = req.body;

    if (!userId || !fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        error: { message: 'Missing required fields', code: 'MISSING_FIELDS' }
      });
    }

    const trade = {
      id: tradeIdCounter++,
      userId,
      fromCurrency,
      toCurrency,
      amount,
      exchangeRate: exchangeRate || 1.0,
      convertedAmount: amount * (exchangeRate || 1.0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    trades.push(trade);

    res.status(201).json({
      message: 'Trade created',
      trade
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/trades/:id
 * Get a specific trade
 */
router.get('/:id', (req, res) => {
  const trade = trades.find(t => t.id === parseInt(req.params.id));

  if (!trade) {
    return res.status(404).json({
      error: { message: 'Trade not found', code: 'NOT_FOUND' }
    });
  }

  res.json({ trade });
});

/**
 * PUT /api/trades/:id
 * Update a trade
 */
router.put('/:id', (req, res) => {
  const trade = trades.find(t => t.id === parseInt(req.params.id));

  if (!trade) {
    return res.status(404).json({
      error: { message: 'Trade not found', code: 'NOT_FOUND' }
    });
  }

  const { status, exchangeRate } = req.body;
  if (status) trade.status = status;
  if (exchangeRate) {
    trade.exchangeRate = exchangeRate;
    trade.convertedAmount = trade.amount * exchangeRate;
  }
  trade.updatedAt = new Date().toISOString();

  res.json({
    message: 'Trade updated',
    trade
  });
});

module.exports = router;
