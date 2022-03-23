// External Dependencies
const express = require('express');

// Internal Dependencies
const categoryController = require('./category.controller');
const isAuth = require('../middleware/auth');

// Router Setup
const Router = express.Router();

/*
 * @route   POST /
 * @desc    Create New Category
 * @access  Private
 */
Router.post('/', isAuth, categoryController.createCategory);

/*
 * @route   GET /
 * @desc    Get All Categories
 * @access  Public
 */
Router.get('/', categoryController.getAllCategories);

module.exports = Router;
