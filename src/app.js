// External Import
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Internal Import
const routes = require('./routes/v1');

// Express App
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routes
app.use('/', routes);

module.exports = app;
