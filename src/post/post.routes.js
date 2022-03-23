// External Dependencies
const express = require('express');

// Internal Dependencies
const postController = require('./post.controller');
const isAuth = require('../middleware/auth');
const upload = require('../config/multer');

// Router Setup
const Router = express.Router();

/*
 * @route   POST /
 * @desc    Create New Post
 * @access  Private
 */
Router.post('/', isAuth, upload.single('image'), postController.createPost);

/*
 * @route   PUT /:id
 * @desc    Update Post
 * @access  Private
 */
Router.put('/:id', isAuth, upload.single('image'), postController.updatePost);

/*
 * @route   DELETE /:id
 * @desc    Delete Post
 * @access  Private
 */
Router.delete('/:id', isAuth, postController.deletePost);

/*
 * @route   GET /:id
 * @desc    Get Post
 * @access  Public
 */
Router.get('/:id', postController.getPostById);

/*
 * @route   PUT /:id/like
 * @desc    Like Dislike Toggle
 * @access  Private
 */
Router.put('/:id/like', isAuth, postController.likeDislikeToggle);

/*
 * @route   GET /user/timeline
 * @desc    Get all the post of following users
 * @access  Private
 */
Router.get('/user/timeline', isAuth, postController.getTimelinePosts);

/*
 * @route   GET /profile/:username
 * @desc    Get all the post of the user with username
 * @access  Private
 */
Router.get('/profile/:username', postController.getAllPostsByUsername);

/*
 * @route   GET /posts
 * @desc    Get All Public Posts
 * @access  Public
 */
Router.get('/list/public', postController.getAllPublicPosts);

module.exports = Router;
