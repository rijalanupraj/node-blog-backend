// External Dependencies
const express = require('express');

// Internal Dependencies
const userController = require('./user.controller');
const isAuth = require('../middleware/auth');

// Router Setup
const Router = express.Router();

/*
 * @route   GET /
 * @desc    Get Current User
 * @access  Private
 */
Router.get('/', isAuth, userController.getCurrentUser);

/*
 * @route   PUT /
 * @desc    Update User
 * @access  Private
 */
Router.put('/', isAuth, userController.updateUser);

/*
 * @route   DELETE /
 * @desc    Delete User
 * @access  Private
 */
Router.delete('/', isAuth, userController.deleteUser);

/*
 * @route   GET /:id
 * @desc    Get User By Id
 * @access  Public
 */
Router.get('/:id', userController.getUserById);

/*
 * @route   PUT /:id/follow
 * @desc    Follow User
 * @access  Private
 */
Router.put('/:id/follow', isAuth, userController.followUser);

/*
 * @route   PUT /:id/unfollow
 * @desc    Follow User
 * @access  Private
 */
Router.put('/:id/unfollow', isAuth, userController.unFollowUser);

module.exports = Router;
