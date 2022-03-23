// External Import
const multer = require('multer');
const path = require('path');

// Internal Import
const ExpressError = require('../helpers/expressError');

// Multer Configuration
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new ExpressError('Only images are allowed', 400), false);
    }
    cb(null, true);
  }
});
