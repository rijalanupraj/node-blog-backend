// External Dependencies
const express = require('express');

// Internal Dependencies
const commentController = require('./comment.controller');
const isAuth = require('../middleware/auth');

// Router Setup
const Router = express.Router();

/*
 * @route   POST /:Post id
 * @desc    Post New Comment
 * @access  Private
 */
Router.post('/post/:id', isAuth, commentController.createComment);

/*
 * @route   PUT /: Comment Id
 * @desc    Edit Comment
 * @access  Private
 */
Router.put('/:id', isAuth, commentController.updateComment);

/*
 * @route   DELETE /: Comment Id
 * @desc    Delete Comment
 * @access  Private
 */
Router.delete('/post/:postId/:commentId', isAuth, commentController.deleteComment);

module.exports = Router;
