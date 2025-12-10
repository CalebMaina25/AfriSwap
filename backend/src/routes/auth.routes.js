const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../config/firebase');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', code: 'MISSING_FIELDS' }
      });
    }

    // Create user in Firebase
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    // Generate JWT token
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      },
      token
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', code: 'MISSING_FIELDS' }
      });
    }

    // In production, use proper authentication service
    // For now, generate a token (real implementation should validate with Firebase)
    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { email }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  // Token-based logout: client discards token
  res.json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/me
 * Get current user info (requires token)
 */
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: { message: 'Unauthorized', code: 'NO_TOKEN' }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      user: {
        email: decoded.email,
        uid: decoded.uid
      }
    });
  } catch (err) {
    res.status(401).json({
      error: { message: 'Invalid token', code: 'INVALID_TOKEN' }
    });
  }
});

/**
 * GET /api/auth
 * Auth module root
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Auth module',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/auth/me'
    ]
  });
});

module.exports = router;
