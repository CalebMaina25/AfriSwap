const express = require('express');

const router = express.Router();

// In-memory wallet storage for demo (replace with database)
const wallets = {};

/**
 * GET /api/wallet
 * Wallet module info
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Wallet module',
    endpoints: [
      'GET /api/wallet/:userId',
      'POST /api/wallet/:userId/deposit',
      'POST /api/wallet/:userId/withdraw',
      'GET /api/wallet/:userId/transactions'
    ]
  });
});

/**
 * GET /api/wallet/:userId
 * Get wallet balance
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const wallet = wallets[userId] || { userId, balance: 0, currencies: {} };

  res.json({
    message: 'Wallet balance',
    wallet
  });
});

/**
 * POST /api/wallet/:userId/deposit
 * Deposit funds into wallet
 */
router.post('/:userId/deposit', (req, res) => {
  const { userId } = req.params;
  const { currency, amount } = req.body;

  if (!currency || !amount || amount <= 0) {
    return res.status(400).json({
      error: { message: 'Currency and positive amount required', code: 'INVALID_DEPOSIT' }
    });
  }

  if (!wallets[userId]) {
    wallets[userId] = {
      userId,
      balance: 0,
      currencies: {}
    };
  }

  const wallet = wallets[userId];
  if (!wallet.currencies[currency]) {
    wallet.currencies[currency] = 0;
  }

  wallet.currencies[currency] += amount;
  wallet.balance += amount;

  res.json({
    message: 'Deposit successful',
    wallet,
    transaction: {
      type: 'deposit',
      currency,
      amount,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * POST /api/wallet/:userId/withdraw
 * Withdraw funds from wallet
 */
router.post('/:userId/withdraw', (req, res) => {
  const { userId } = req.params;
  const { currency, amount } = req.body;

  if (!currency || !amount || amount <= 0) {
    return res.status(400).json({
      error: { message: 'Currency and positive amount required', code: 'INVALID_WITHDRAWAL' }
    });
  }

  const wallet = wallets[userId];
  if (!wallet || !wallet.currencies[currency] || wallet.currencies[currency] < amount) {
    return res.status(400).json({
      error: { message: 'Insufficient balance', code: 'INSUFFICIENT_BALANCE' }
    });
  }

  wallet.currencies[currency] -= amount;
  wallet.balance -= amount;

  res.json({
    message: 'Withdrawal successful',
    wallet,
    transaction: {
      type: 'withdrawal',
      currency,
      amount,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * GET /api/wallet/:userId/transactions
 * Get wallet transactions
 */
router.get('/:userId/transactions', (req, res) => {
  const { userId } = req.params;

  // Demo: return empty list
  res.json({
    message: 'Transactions',
    userId,
    transactions: []
  });
});

module.exports = router;
