// External Import
const cloudinary = require('cloudinary').v2;

// Internal Import
const { CLOUDINARY } = require('./keys');

cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET
});

module.exports = cloudinary;
