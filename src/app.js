// External Import
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Internal Import
const v1Routes = require('./routes/v1');
const { APP } = require('./config/keys');

// Express App
const app = express();

// Passport Config
require('./config/passport')(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routes
app.use(`${APP.BASE_API_URL}`, v1Routes);

// Catch Error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).json({ statusCode, success: false, errorMessage: err.message });
});

module.exports = app;
