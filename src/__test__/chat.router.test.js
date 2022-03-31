// External Import
const mongoose = require('mongoose');
const supertest = require('supertest');

// Internal Import
const app = require('../app');
const { APP } = require('../config/keys');

const request = supertest(app);

beforeAll(done => {
  mongoose.connect(
    'mongodb://localhost:27017/chatTest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll(done => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

let FIRST_USER_ID = '';
let FIRST_USER_TOKEN = '';
let SECOND_USER_ID = '';
let CONVERSATION_ID = '';

describe('POST chat/create - Create New Conversation', () => {
  it('When the token is not provided', async () => {
    const response = await request.post(`${APP.BASE_API_URL}/chat/create`);
    expect(response.status).toBe(401);
  });

  it('Create Conversation with 201 status code', async () => {
    // First we need a token to be provided
    const payload = {
      username: 'test1',
      email: 'test1@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    const token = regResponse.body.token;
    FIRST_USER_TOKEN = token;
    FIRST_USER_ID = regResponse.body.user._id;

    // Create Another User
    const secondUser = await request.post(`${APP.BASE_API_URL}/auth/register`).send({
      username: 'test2',
      email: 'test2@test.com',
      password: 'Test@123'
    });
    expect(secondUser.status).toBe(201);
    SECOND_USER_ID = secondUser.body.user._id;

    // Now we have the token, we can test create category
    const response = await request
      .post(`${APP.BASE_API_URL}/chat/create`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        participantId: secondUser.body.user._id
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    CONVERSATION_ID = response.body.conversation._id;
    expect(response.body.conversation).toEqual({
      creator: expect.any(Object),
      participant: expect.any(Object),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      _id: expect.any(String),
      __v: 0
    });
  });
});

describe('GET chat/conversations - Get All Conversation of the current User', () => {
  it('When the token is not provided', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/chat/conversations`);
    expect(response.status).toBe(401);
  });

  it('Create Conversation with 200 status code', async () => {
    const response = await request
      .get(`${APP.BASE_API_URL}/chat/conversations`)
      .set('Authorization', `Bearer ${FIRST_USER_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.conversations).toEqual(expect.any(Array));
  });
});

describe('GET chat/messages/:conversationId - Get Chat Messages from Conversation', () => {
  it('When the token is not provided', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/chat/messages/${CONVERSATION_ID}`);
    console.log(response.body);
    expect(response.status).toBe(401);
  });

  it('Create Messages of a certain conversation with 200 status code', async () => {
    const response = await request
      .get(`${APP.BASE_API_URL}/chat/messages/${CONVERSATION_ID}`)
      .set('Authorization', `Bearer ${FIRST_USER_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.messages).toEqual(expect.any(Array));
  });
});

describe('GET chat/messages/unseen - Get Unseen Messages from Conversation', () => {
  it('When the token is not provided', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/chat/unseen/messages`);
    expect(response.status).toBe(401);
  });

  it('Unseen Messages of a User with 200 status code', async () => {
    const response = await request
      .get(`${APP.BASE_API_URL}/chat/unseen/messages`)
      .set('Authorization', `Bearer ${FIRST_USER_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.messages).toEqual(expect.any(Array));
  });
});
