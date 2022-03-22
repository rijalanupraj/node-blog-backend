// External Dependencies
const express = require('express');

// Internal Dependencies
const userController = require('./user.controller');
const isAuth = require('../middleware/auth');

// Router Setup
const Router = express.Router();

/*
 * @route   GET /current-user
 * @desc    Get Current User
 * @access  Private
 */
Router.get('/current', isAuth, userController.getCurrentUser);

module.exports = Router;
