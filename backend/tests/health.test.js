const request = require('supertest');

const app = require('../server');

test('GET /health returns 200', async () => {
  const res = await request(app).get('/health');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('status', 'OK');
});
