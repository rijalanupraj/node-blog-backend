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

describe('GET user/ - Test Current User Route', () => {
  it('When the token is not provided', async () => {
    const response = await request.get(`${APP.BASE_API_URL}/user/`);
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
      .get(`${APP.BASE_API_URL}/user/`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      user: {
        _id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        followers: expect.any(Array),
        followings: expect.any(Array),
        isAdmin: false,
        profilePhoto: expect.any(Object)
      }
    });
  });
});

describe('GET user/:id - Test Get User By Id Route', () => {
  it('Random User - should get 404 Error', async () => {
    const response = await request.get(
      `${APP.BASE_API_URL}/user/${mongoose.Schema.Types.ObjectId}`
    );
    expect(response.status).toBe(404);
  });

  it('Get 200 and user detail', async () => {
    // First we need a token to be provided
    const payload = {
      username: 'test21',
      email: 'test21@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    const userId = regResponse.body.user._id;

    // Now we have the token, we can test current user
    const response = await request.get(`${APP.BASE_API_URL}/user/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      user: {
        id: userId,
        username: expect.any(String),
        followers: expect.any(Array),
        followings: expect.any(Array)
      }
    });
  });
});

describe('PUT user/ - Test User Update Route', () => {
  it('When the token is not provided', async () => {
    const response = await request.put(`${APP.BASE_API_URL}/user/`);
    expect(response.status).toBe(401);
  });

  it('Get 200 and user detail', async () => {
    // First we need a token to be provided
    const payload = {
      username: 'test2',
      email: 'test2@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    const token = regResponse.body.token;

    // Now we have the token, we can test current user
    const response = await request
      .put(`${APP.BASE_API_URL}/user/`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test10',
        password: 'Test@1234',
        email: 'test10@test.com'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      user: {
        _id: expect.any(String),
        username: 'test10',
        email: 'test10@test.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        followers: expect.any(Array),
        followings: expect.any(Array),
        isAdmin: false,
        profilePhoto: expect.any(Object)
      }
    });
  });
});

describe('DELETE user/ - Test User Delete Route', () => {
  it('When the token is not provided', async () => {
    const response = await request.delete(`${APP.BASE_API_URL}/user/`);
    expect(response.status).toBe(401);
  });

  it('Delete User and get 200 response', async () => {
    // First we need a token to be provided
    const payload = {
      username: 'test3',
      email: 'test3@test.com',
      password: 'Test@123'
    };

    const regResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send(payload);
    expect(regResponse.status).toBe(201);
    const token = regResponse.body.token;

    // Now we have the token, we can test current user
    const response = await request
      .delete(`${APP.BASE_API_URL}/user/`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
});

describe('PUT user/:id/follow - Test User Follow Route', () => {
  it("Random User Id which doesn't exist", async () => {
    const response = await request.delete(
      `${APP.BASE_API_URL}/user/${mongoose.Schema.Types.ObjectId}/follow`
    );
    expect(response.status).toBe(404);
  });

  it('Follow User with 200 response', async () => {
    // First we need a token to be provided
    const firstUserPayLoad = {
      username: 'test5',
      email: 'test5@test.com',
      password: 'Test@123'
    };
    const secondUserPayload = {
      username: 'test6',
      email: 'test6@test.com',
      password: 'Test@123'
    };

    const firstUser = await request
      .post(`${APP.BASE_API_URL}/auth/register`)
      .send(firstUserPayLoad);
    const secondUser = await request
      .post(`${APP.BASE_API_URL}/auth/register`)
      .send(secondUserPayload);

    const firstUserToken = firstUser.body.token;
    const secondUserId = secondUser.body.user._id;

    // Now we have the token, we can test current user
    const response = await request
      .put(`${APP.BASE_API_URL}/user/${secondUserId}/follow`)
      .set('Authorization', `Bearer ${firstUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
});

// This test depends on above follow test as the user is already followed by the first user above and now we are testing unfollow
// TODO: Better To Do This Separately
describe('PUT user/:id/unfollow - Test User Unfollow Route', () => {
  it("Random User Id which doesn't exist", async () => {
    const response = await request.delete(
      `${APP.BASE_API_URL}/user/${mongoose.Schema.Types.ObjectId}/unfollow`
    );
    expect(response.status).toBe(404);
  });

  it('UnFoll User with 200 response', async () => {
    // First we need a token to be provided
    const firstUserPayLoad = {
      emailOrUsername: 'test5',
      password: 'Test@123'
    };
    const secondUserPayload = {
      emailOrUsername: 'test6',
      password: 'Test@123'
    };

    const firstUser = await request.post(`${APP.BASE_API_URL}/auth/login`).send(firstUserPayLoad);
    const secondUser = await request.post(`${APP.BASE_API_URL}/auth/login`).send(secondUserPayload);

    const firstUserToken = firstUser.body.token;
    const secondUserId = secondUser.body.user._id;

    // Now we have the token, we can test current user
    const response = await request
      .put(`${APP.BASE_API_URL}/user/${secondUserId}/unfollow`)
      .set('Authorization', `Bearer ${firstUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String)
    });
  });
});

describe('PUT -  user/profile-photo Update Profile Photo', () => {
  jest.setTimeout(13000);
  it('When token is not provided', async () => {
    const response = await request.put(`${APP.BASE_API_URL}/user/profile-photo`);
    expect(response.status).toBe(401);
  });

  it('When image is not provided', async () => {
    // User Register
    const userResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send({
      username: 'test13',
      email: 'test13@test.com',
      password: 'Test@123'
    });
    const TOKEN = userResponse.body.token;

    const response = await request
      .put(`${APP.BASE_API_URL}/user/profile-photo`)
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: expect.any(String),
      statusCode: 400
    });
  });

  it('Should Return 200 when image is provided', async () => {
    // User Register
    const userResponse = await request.post(`${APP.BASE_API_URL}/auth/register`).send({
      username: 'test18',
      email: 'test18@test.com',
      password: 'Test@123'
    });
    const TOKEN = userResponse.body.token;

    const response = await request
      .put(`${APP.BASE_API_URL}/user/profile-photo`)
      .set('Authorization', `Bearer ${TOKEN}`)
      .set('content-type', 'multipart/form-data')
      .attach(
        'profilePhoto',
        fs.readFileSync(`${__dirname}/testimage/profile.png`),
        'testimage/profile.png'
      );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      user: {
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        profilePhoto: {
          url: expect.any(String),
          filename: expect.any(String),
          hasPhoto: true
        },
        followings: expect.any(Array),
        followers: expect.any(Array)
      }
    });
  });
});

describe('DELETE -  user/profile-photo Delete Profile Photo', () => {
  it('When token is not provided', async () => {
    const response = await request.delete(`${APP.BASE_API_URL}/user/profile-photo`);
    expect(response.status).toBe(401);
  });

  it('Should Return 200 ', async () => {
    // User Register
    const userResponse = await request.post(`${APP.BASE_API_URL}/auth/login`).send({
      emailOrUsername: 'test18',
      password: 'Test@123'
    });
    const TOKEN = userResponse.body.token;

    const response = await request
      .delete(`${APP.BASE_API_URL}/user/profile-photo`)
      .set('Authorization', `Bearer ${TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: expect.any(String),
      user: {
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        profilePhoto: {
          url: expect.any(String),
          filename: expect.any(String),
          hasPhoto: false
        },
        followings: expect.any(Array),
        followers: expect.any(Array)
      }
    });
  });

  it('When No Image it should return 400 not found error', async () => {
    // User Register
    const userResponse = await request.post(`${APP.BASE_API_URL}/auth/login`).send({
      emailOrUsername: 'test18',
      password: 'Test@123'
    });
    const TOKEN = userResponse.body.token;

    const response = await request
      .delete(`${APP.BASE_API_URL}/user/profile-photo`)
      .set('Authorization', `Bearer ${TOKEN}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: expect.any(String),
      statusCode: 400
    });
  });
});
