// External Import
const mongoose = require('mongoose');
const supertest = require('supertest');
const fs = require('fs');

// Internal Import
const app = require('../app');
const { APP } = require('../config/keys');

const request = supertest(app);

beforeAll(done => {
  mongoose.connect(
    'mongodb://localhost:27017/categoryTest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll(done => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('POST category/ - Create Category Test', () => {
  it('When the token is not provided', async () => {
    const response = await request.post(`${APP.BASE_API_URL}/category/`);
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

    // Now we have the token, we can test create category
    const response = await request
      .post(`${APP.BASE_API_URL}/category/`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Category'
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      category: {
        name: 'Test Category',
        _id: expect.any(String),
        __v: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    });
  });
});

describe('GET category/ - Get All Categories', () => {
  it('Get 200 and user detail', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/category/`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      categories: expect.any(Array)
    });
  });
});
