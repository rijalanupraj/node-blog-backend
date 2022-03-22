// External Import
const mongoose = require('mongoose');
const supertest = require('supertest');

// Internal Import
const app = require('../app');
const { APP } = require('../config/keys');

const request = supertest(app);

beforeAll(done => {
  mongoose.connect(
    'mongodb://localhost:27017/userTest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll(done => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('user/current - Test Current User Route', () => {
  it('When the token is not provided', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/user/current`);
    expect(response.status).toBe(401);
  });

  it('Get 200 and user detail', async () => {
    // First we need a token to be provided
    const payload = {
      username: 'test1',
      email: 'test1@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    const token = regResponse.body.token;

    // Now we have the token, we can test current user
    const response = await request
      .get(`${APP.BASE_API_URL}/user/current`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      user: {
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String)
      }
    });
  });
});
