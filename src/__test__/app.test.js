// External Import
const supertest = require('supertest');

// Internal Import
const app = require('../app');

const request = supertest(app);

describe('/api/v1/test: Test Endpoint', () => {
  it('should return a response Hello world', async () => {
    const response = await request.get('/api/v1/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
  });
});
