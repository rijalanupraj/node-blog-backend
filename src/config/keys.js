module.exports = {
  APP: {
    NAME: 'Node Blog',
    BASE_API_URL: process.env.BASE_API_URL || '/api/v1'
  },
  PORT: process.env.PORT || 8000,
  DATABASE: {
    URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projectsDatabase'
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    TOKEN_LIFE: '7d'
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
};
