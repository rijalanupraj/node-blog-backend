// External Import
const mongoId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

// Internal Import
const Post = require('../post/post.model');
const User = require('../user/user.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');
const cloudinary = require('../config/cloudinary');
const PostValidation = require('../post/post.validation');

// Create New Post
const createPost = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const { error } = PostValidation.validate(req.body);

  if (error) {
    return next(new ExpressError(error.details[0].message, 400));
  }

  const { title, content, status, allowComments } = req.body;

  const newPost = new Post({
    title,
    content,
    status,
    allowComments
  });

  let imageUrl = '';
  let imageKey = '';
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogam/posts'
    });
    imageUrl = result.secure_url;
    imageKey = result.public_id;
  }

  newPost.image = {
    url: imageUrl,
    filename: imageKey
  };

  // Assigning Author
  newPost.author = id;

  const post = await newPost.save();

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post
  });
});

// Update Post
const updatePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const postId = req.params.id;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const { title, content, status, allowComments } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ExpressError('Post not found', 404));
  }

  if (post.author.toString() !== id) {
    return next(new ExpressError('You are not authorized to update this post', 403));
  }

  if (title) {
    post.title = title;
  }

  if (content) {
    post.content = content;
  }

  if (status) {
    post.status = status;
  }

  if (allowComments === true || allowComments === false) {
    post.allowComments = allowComments;
  }

  let imageUrl = '';
  let imageKey = '';
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogam/posts'
    });
    imageUrl = result.secure_url;
    imageKey = result.public_id;
    await cloudinary.uploader.destroy(post.image.filename);
    post.image = {
      url: imageUrl,
      filename: imageKey
    };
  }

  const updatedPost = await post.save();

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    post: updatedPost
  });
});

// Delete Post
const deletePost = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const postId = req.params.id;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ExpressError('Post not found', 404));
  }

  if (post.author.toString() !== id) {
    return next(new ExpressError('You are not authorized to delete this post', 403));
  }

  if (post.image.filename) {
    await cloudinary.uploader.destroy(post.image.filename);
  }
  await post.remove();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully'
  });
});

// Get Post By Id
const getPostById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const post = await Post.findOne({
    _id: id,
    status: 'public',
    isActive: true
  }).populate('author');

  if (!post) {
    return next(new ExpressError('Post not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Post found successfully',
    post
  });
});

// Like Dislike
const likeDislikeToggle = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const postId = req.params.id;

  if (!mongoId.isValid(id) || !mongoId.isValid(postId)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  const findPost = await Post.findById(postId);

  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }
  if (!findPost) {
    return next(new ExpressError('Post not found', 404));
  }

  if (!findPost.likes.includes(id)) {
    await findPost.updateOne({
      $push: {
        likes: id
      }
    });
    res.status(200).json({
      success: true,
      message: 'Post liked successfully'
    });
  } else {
    await findPost.updateOne({
      $pull: {
        likes: id
      }
    });
    res.status(200).json({
      success: true,
      message: 'Post disliked successfully'
    });
  }
});

// Timeline Post of User followed
const getTimelinePosts = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const followedUsersPosts = await Promise.all(
    findUser.followings.map(async userId => {
      return Post.find({
        author: userId,
        status: 'public',
        isActive: true
      });
    })
  );

  return res.status(200).json({
    success: true,
    message: 'Posts found successfully',
    posts: followedUsersPosts
  });
});

const getAllPostsByUsername = asyncWrapper(async (req, res, next) => {
  const { username } = req.params;
  if (!username) {
    return next(new ExpressError('Invalid Username', 400));
  }

  const findUser = await User.findOne({ username });
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const userPosts = await Post.find({
    author: findUser._id,
    status: 'public',
    isActive: true
  });

  return res.status(200).json({
    success: true,
    message: 'Posts found successfully',
    posts: userPosts
  });
});

const getAllPublicPosts = asyncWrapper(async (req, res, next) => {
  const posts = await Post.find({
    status: 'public',
    isActive: true
  });

  return res.status(200).json({
    success: true,
    message: 'Posts found successfully',
    posts
  });
});

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  likeDislikeToggle,
  getTimelinePosts,
  getAllPostsByUsername,
  getAllPublicPosts
};
