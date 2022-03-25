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
    'mongodb://localhost:27017/commentTest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll(done => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

let TOKEN = '';
let POST_ID = '';
let COMMENT_ID = '';
describe('POST comment/post/:postId - Create Category Test', () => {
  it('Register User & Add Post Initially', async () => {
    const payload = {
      username: 'test1',
      email: 'test1@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    TOKEN = regResponse.body.token;

    const postPayload = {
      title: 'Test Post',
      content: 'Test Description',
      status: 'public'
    };

    // Now we have the token, we can test create post
    const response = await request
      .post(`${APP.BASE_API_URL}/post/`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(postPayload);

    POST_ID = response.body.post._id;
    expect(response.status).toBe(201);
  });

  it('When the token is not provided', async () => {
    const response = await request.post(`${APP.BASE_API_URL}/comment/post/${POST_ID}`);
    expect(response.status).toBe(401);
  });

  it('Get 200', async () => {
    const commentPayload = {
      text: 'Test Comment'
    };

    const response = await request
      .post(`${APP.BASE_API_URL}/comment/post/${POST_ID}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(commentPayload);

    expect(response.status).toBe(201);
    COMMENT_ID = response.body.comment._id;
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      comment: {
        text: commentPayload.text,
        author: expect.any(Object),
        __v: expect.any(Number),
        isActive: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        _id: expect.any(String)
      }
    });
  });
});

describe('PUT comment/ - Update All Comments', () => {
  it('Get 200', async () => {
    const commentPayload = {
      text: 'Test Comment Updated'
    };

    const response = await request
      .put(`${APP.BASE_API_URL}/comment/${COMMENT_ID}`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(commentPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      comment: {
        text: commentPayload.text,
        author: expect.any(Object),
        __v: expect.any(Number),
        isActive: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        _id: expect.any(String)
      }
    });
  });
});

describe('Delete comment/post/:postId/:commentId - Delete Comment', () => {
  it('Get 200', async () => {
    const response = await request
      .delete(`${APP.BASE_API_URL}/comment/post/${POST_ID}/${COMMENT_ID}`)
      .set('Authorization', `Bearer ${TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
});
