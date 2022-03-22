module.exports = {
  APP: {
    NAME: 'Node Blog',
    BASE_API_URL: '/api/v1'
  },
  PORT: process.env.PORT || 8000,
  DATABASE: {
    URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projectsDatabase'
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    TOKEN_LIFE: '7d'
  }
};
