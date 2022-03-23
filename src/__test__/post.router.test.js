// External Import
const mongoose = require('mongoose');
const supertest = require('supertest');
const fs = require('fs');

// Internal Import
const app = require('../app');
const { APP } = require('../config/keys');
const cloudinary = require('../config/cloudinary');

const request = supertest(app);

beforeAll(done => {
  mongoose.connect(
    'mongodb://localhost:27017/postTest',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll(done => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

let POST_ID = '';
describe('POST post/ - Create Post Test', () => {
  it('When the token is not provided', async () => {
    const response = await request.post(`${APP.BASE_API_URL}/post/`);
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

    const postPayload = {
      title: 'Test Post',
      content: 'Test Description',
      status: 'private'
    };

    // Now we have the token, we can test create post
    const response = await request
      .post(`${APP.BASE_API_URL}/post/`)
      .set('Authorization', `Bearer ${token}`)
      .send(postPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      post: {
        title: postPayload.title,
        content: postPayload.content,
        status: postPayload.status,
        image: expect.any(Object),
        isActive: true,
        allowComments: true,
        likes: expect.any(Array),
        _id: expect.any(String),
        author: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        slug: expect.any(String),
        __v: expect.any(Number)
      }
    });
    POST_ID = response.body.post._id;
  });
});

describe('PUT post/:id - Update Post Test', () => {
  it('When the token is not provided', async () => {
    const response = await request.put(`${APP.BASE_API_URL}/post/${POST_ID}`);
    expect(response.status).toBe(401);
  });

  it('Get 200 and update Post', async () => {
    // First we need a token to be provided
    const payload = {
      emailOrUsername: 'test1',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/login`).send(payload);
    expect(regResponse.status).toBe(200);
    const token = regResponse.body.token;

    const updatedPayload = {
      title: 'Test Post Updated',
      content: 'Test Description Updated',
      status: 'public',
      allowComments: false
    };

    // Now we have the token, we can test create post
    const response = await request
      .put(`${APP.BASE_API_URL}/post/${POST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      post: {
        title: updatedPayload.title,
        content: updatedPayload.content,
        status: updatedPayload.status,
        image: expect.any(Object),
        isActive: true,
        allowComments: updatedPayload.allowComments,
        likes: expect.any(Array),
        _id: expect.any(String),
        author: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        slug: expect.any(String),
        __v: expect.any(Number)
      }
    });
  });
});

describe('GET post/:id - Get Post By Id Test', () => {
  it('Should Return 200', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/post/${POST_ID}`);
    expect(response.status).toBe(200);
  });

  it('Get 200 and update Post', async () => {
    // Now we have the token, we can test create post
    const response = await request.get(`${APP.BASE_API_URL}/post/${POST_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      post: {
        title: expect.any(String),
        content: expect.any(String),
        status: expect.any(String),
        image: expect.any(Object),
        isActive: expect.any(Boolean),
        allowComments: expect.any(Boolean),
        likes: expect.any(Array),
        _id: expect.any(String),
        author: {
          profilePhoto: expect.any(Object),
          _id: expect.any(String),
          username: expect.any(String),
          followers: expect.any(Array),
          followings: expect.any(Array)
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        slug: expect.any(String),
        __v: expect.any(Number)
      }
    });
  });
});

// Like Dislike Post Toggle Test
describe('PUT post/:id/like - Like/Unlike Post Test', () => {
  it('When the token is not provided', async () => {
    const response = await request.put(`${APP.BASE_API_URL}/post/${POST_ID}/like`);
    expect(response.status).toBe(401);
  });

  it('Get 200 and update Post', async () => {
    // First we need a token to be provided
    const payload = {
      emailOrUsername: 'test1',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/login`).send(payload);
    expect(regResponse.status).toBe(200);
    const token = regResponse.body.token;

    // Now we have the token, we can test create post
    const response = await request
      .put(`${APP.BASE_API_URL}/post/${POST_ID}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
});

// Timeline Post Test
describe('GET post/user/timeline - Get Timeline Post Test', () => {
  it('401 When Token is not passed', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/post/user/timeline`);
    expect(response.status).toBe(401);
  });

  it('Get 200 and update Post', async () => {
    // Now we have the token, we can test create post
    // First we need a token to be provided
    const payload = {
      emailOrUsername: 'test1',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/login`).send(payload);
    expect(regResponse.status).toBe(200);
    const token = regResponse.body.token;

    const response = await request
      .get(`${APP.BASE_API_URL}/post/user/timeline`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      posts: expect.any(Array)
    });
  });
});

// All Posts Of a User
describe('GET post/profile/:username - Get All Posts Of a User Test', () => {
  it('Get 200 and All Posts of the User', async () => {
    // Now we have the token, we can test create post
    const response = await request.get(`${APP.BASE_API_URL}/post/profile/test1`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      posts: expect.any(Array)
    });
  });
});

// All Public Post
describe('GET post/list/public - Get All Public Posts', () => {
  it('Get 200 and All Public Posts ', async () => {
    // Now we have the token, we can test create post
    const response = await request.get(`${APP.BASE_API_URL}/post/list/public`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      posts: expect.any(Array)
    });
  });
});

// Post Delete
describe('DELETE post/:id - Delete Post Test', () => {
  it('When the token is not provided', async () => {
    const response = await request.delete(`${APP.BASE_API_URL}/post/${POST_ID}`);
    expect(response.status).toBe(401);
  });

  it('If Another User Tries to Delete should get 403', async () => {
    // First we need a token to be provided
    const payload = {
      username: 'test2',
      email: 'test2@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    const token = regResponse.body.token;

    // Now we have the token, we can test Delete post
    const response = await request
      .delete(`${APP.BASE_API_URL}/post/${POST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: expect.any(String),
      statusCode: 403
    });
  });

  it('Get 200 and Delete Post', async () => {
    // First we need a token to be provided
    const payload = {
      emailOrUsername: 'test1',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/login`).send(payload);
    expect(regResponse.status).toBe(200);
    const token = regResponse.body.token;

    // Now we have the token, we can test Delete post
    const response = await request
      .delete(`${APP.BASE_API_URL}/post/${POST_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
});
