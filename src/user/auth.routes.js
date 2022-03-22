// External Dependencies
const express = require('express');

// Internal Dependencies
const authController = require('./auth.controller');

// Router Setup
const Router = express.Router();

/*
 * @route   POST /register
 * @desc    Register User
 * @access  Public
 */
Router.post('/register', authController.registerUser);

/*
 * @route   POST /login
 * @desc    Login User
 * @access  Public
 */
Router.post('/login', authController.loginUser);

module.exports = Router;
