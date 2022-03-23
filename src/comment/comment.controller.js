// External Import
const mongoId = require('mongoose').Types.ObjectId;

// Internal Import
const User = require('../user/user.model');
const Post = require('../post/post.model');
const Comment = require('./comment.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');

// Create New Comment
const createComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const postId = req.params.id;
  const { text } = req.body;

  if (!mongoId.isValid(id) || !mongoId.isValid(postId)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const findPost = await Post.findById(postId);
  if (!findPost) {
    return next(new ExpressError('Post not found', 404));
  }

  if (findPost.allowComments === false) {
    return next(new ExpressError('Comments are not allowed for this post', 400));
  }

  const newComment = new Comment({ text });
  newComment.author = id;

  const savedComment = await newComment.save();

  findPost.comments.push(savedComment._id);
  await findPost.save();

  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    comment: savedComment
  });
});

// Update Comment
const updateComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const commentId = req.params.id;
  const { text } = req.body;

  if (!mongoId.isValid(id) || !mongoId.isValid(commentId)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const findComment = await Comment.findById(commentId);
  if (!findComment) {
    return next(new ExpressError('Comment not found', 404));
  }

  if (findComment.author.toString() !== id) {
    return next(new ExpressError('You are not authorized to update this comment', 400));
  }

  findComment.text = text;
  await findComment.save();

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    comment: findComment
  });
});

// Delete Comment
const deleteComment = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { postId, commentId } = req.params;

  if (!mongoId.isValid(id) || !mongoId.isValid(commentId) || !mongoId.isValid(postId)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const findPost = await Post.findById(postId);
  if (!findPost) {
    return next(new ExpressError('Post not found', 404));
  }

  const findComment = await Comment.findById(commentId);
  if (!findComment) {
    return next(new ExpressError('Comment not found', 404));
  }

  if (findComment.author.toString() !== id) {
    return next(new ExpressError('You are not authorized to delete this comment', 400));
  }

  await findComment.remove();

  // Remove comment from post
  findPost.comments = findPost.comments.filter(comment => comment.toString() !== commentId);
  await findPost.save();

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

module.exports = {
  createComment,
  updateComment,
  deleteComment
};
