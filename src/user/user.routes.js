// External Dependencies
const express = require('express');

// Internal Dependencies
const userController = require('./user.controller');
const isAuth = require('../middleware/auth');
const upload = require('../config/multer');

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

/*
 * @route   PUT /profile-photo
 * @desc    Update Photo
 * @access  Private
 */
Router.put(
  '/profile-photo',
  isAuth,
  upload.single('profilePhoto'),
  userController.updateProfilePicture
);

/*
 * @route   DELETE /profile-photo
 * @desc    Delete User Profile Photo
 * @access  Private
 */
Router.delete('/profile-photo', isAuth, userController.removeProfilePicture);

module.exports = Router;
