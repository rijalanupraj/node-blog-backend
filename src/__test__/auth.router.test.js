// External Import
const mongoose = require('mongoose');
const supertest = require('supertest');

// Internal Import
const app = require('../app');
const { APP } = require('../config/keys');

const request = supertest(app);

beforeAll(done => {
  mongoose.connect(
    'mongodb://localhost:27017/authTest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll(done => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('/auth/register - Test Register Endpoint', () => {
  it('When there is no payload for registration should respond with 400', async () => {
    const response = await request.post(`${APP.BASE_API_URL}/auth/register`);
    expect(response.status).toBe(400);
  });
  it('Respond token and user information when all payload is provided', async () => {
    const payload = {
      username: 'test1',
      email: 'test1@test.com',
      password: 'Test@123'
    };

    const response = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    const responseBody = response.body;
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      token: expect.any(String),
      user: {
        id: expect.any(String),
        username: payload.username,
        email: payload.email
      }
    });
  });
});

describe('/auth/login - Test Login Endpoint', () => {
  it('When there is no payload for login should respond with 400', async () => {
    const response = await request.post(`${APP.BASE_API_URL}/auth/login`);
    expect(response.status).toBe(400);
  });

  it('Respond token and user information when username is provided with password ', async () => {
    const payload = {
      emailOrUsername: 'test1',
      password: 'Test@123'
    };

    const response = await request.post(`${APP.BASE_API_URL}/auth/login`).send(payload);
    const responseBody = response.body;
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      token: expect.any(String),
      user: {
        id: expect.any(String),
        username: payload.emailOrUsername,
        email: expect.any(String)
      }
    });
  });

  it('Respond token and user information when email is provided with password ', async () => {
    const payload = {
      emailOrUsername: 'test1@test.com',
      password: 'Test@123'
    };

    const response = await request.post(`${APP.BASE_API_URL}/auth/login`).send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      token: expect.any(String),
      user: {
        id: expect.any(String),
        username: expect.any(String),
        email: payload.emailOrUsername
      }
    });
  });
});
