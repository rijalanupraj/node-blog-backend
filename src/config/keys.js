module.exports = {
  APP: {
    NAME: 'Node Blog'
  },
  PORT: process.env.PORT || 8000,
  DATABASE: {
    URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projectsDatabase'
  }
};
