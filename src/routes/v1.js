// External Import
const router = require('express').Router();

// Internal Dependencies
const authRoutes = require('../user/auth.routes');
const userRoutes = require('../user/user.routes');
const postRoutes = require('../post/post.routes');
const categoryRoutes = require('../category/category.routes');
const commentRoutes = require('../comment/comment.routes');
const chatRoutes = require('../chat/chat.routes');

// Auth Routes
router.use('/auth', authRoutes);

// User Routes
router.use('/user', userRoutes);

// Post Routes
router.use('/post', postRoutes);

// Category Routes
router.use('/category', categoryRoutes);

// Comment Routes
router.use('/comment', commentRoutes);

// Chat Routes
router.use('/chat', chatRoutes);

// Test Route for Checking whether the app is working or not
router.use('/test', (req, res) => {
  res.send('Hello world');
});

router.use((req, res) => res.status(404).json('No API route found'));

module.exports = router;
