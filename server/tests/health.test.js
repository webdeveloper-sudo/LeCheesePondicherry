const request = require('supertest');
const app = require('../server');

describe('Backend Health Check', () => {
  it('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Le Pondicherry Cheese API is running');
  });

  it('GET / should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('Welcome to Le Pondicherry Cheese API');
  });
});
