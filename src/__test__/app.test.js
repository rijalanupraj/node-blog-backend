// External Import
const supertest = require('supertest');

// Internal Import
const app = require('../app');

const request = supertest(app);

describe('/test endpoint', () => {
  it('should return a response Hello world', async () => {
    const response = await request.get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
  });
});
