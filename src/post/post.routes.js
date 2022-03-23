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

module.exports = Router;
