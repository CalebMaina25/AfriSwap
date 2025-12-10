const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
  test('GET /api/auth returns endpoints list', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Auth module');
    expect(res.body).toHaveProperty('endpoints');
    expect(Array.isArray(res.body.endpoints)).toBe(true);
  });

  test('POST /api/auth/login without email returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'MISSING_FIELDS');
  });

  test('POST /api/auth/login with valid data returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user.email', 'test@example.com');
  });

  test('POST /api/auth/logout returns success', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout successful');
  });

  test('GET /api/auth/me without token returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error.code', 'NO_TOKEN');
  });

  test('GET /api/auth/me with invalid token returns 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error.code', 'INVALID_TOKEN');
  });
});

describe('Trade Routes', () => {
  test('GET /api/trades returns list', async () => {
    const res = await request(app).get('/api/trades');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Trades');
    expect(res.body).toHaveProperty('count');
    expect(Array.isArray(res.body.trades)).toBe(true);
  });

  test('POST /api/trades without required fields returns 400', async () => {
    const res = await request(app)
      .post('/api/trades')
      .send({ fromCurrency: 'USD' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'MISSING_FIELDS');
  });

  test('POST /api/trades with valid data creates trade', async () => {
    const res = await request(app)
      .post('/api/trades')
      .send({
        userId: 'user123',
        fromCurrency: 'USD',
        toCurrency: 'GHS',
        amount: 100,
        exchangeRate: 12.5
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('trade');
    expect(res.body.trade).toHaveProperty('id');
    expect(res.body.trade).toHaveProperty('status', 'pending');
    expect(res.body.trade).toHaveProperty('convertedAmount', 1250);
  });

  test('GET /api/trades/:id returns specific trade', async () => {
    // First create a trade
    const createRes = await request(app)
      .post('/api/trades')
      .send({
        userId: 'user123',
        fromCurrency: 'USD',
        toCurrency: 'GHS',
        amount: 50
      });
    const tradeId = createRes.body.trade.id;

    // Then fetch it
    const res = await request(app).get(`/api/trades/${tradeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.trade).toHaveProperty('id', tradeId);
  });

  test('GET /api/trades/:id with invalid id returns 404', async () => {
    const res = await request(app).get('/api/trades/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error.code', 'NOT_FOUND');
  });
});

describe('Wallet Routes', () => {
  test('GET /api/wallet returns module info', async () => {
    const res = await request(app).get('/api/wallet');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Wallet module');
    expect(res.body).toHaveProperty('endpoints');
  });

  test('GET /api/wallet/:userId returns balance', async () => {
    const res = await request(app).get('/api/wallet/user123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('wallet');
    expect(res.body.wallet).toHaveProperty('userId', 'user123');
    expect(res.body.wallet).toHaveProperty('balance');
  });

  test('POST /api/wallet/:userId/deposit with valid data adds balance', async () => {
    const res = await request(app)
      .post('/api/wallet/user123/deposit')
      .send({ currency: 'USD', amount: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('wallet');
    expect(res.body.wallet.currencies).toHaveProperty('USD', 100);
  });

  test('POST /api/wallet/:userId/deposit with invalid amount returns 400', async () => {
    const res = await request(app)
      .post('/api/wallet/user123/deposit')
      .send({ currency: 'USD', amount: -50 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error.code', 'INVALID_DEPOSIT');
  });

  test('GET /api/wallet/:userId/transactions returns list', async () => {
    const res = await request(app).get('/api/wallet/user123/transactions');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('transactions');
    expect(Array.isArray(res.body.transactions)).toBe(true);
  });
});
