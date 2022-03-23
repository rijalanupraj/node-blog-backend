// External Import
const router = require('express').Router();

// Internal Dependencies
const authRoutes = require('../user/auth.routes');
const userRoutes = require('../user/user.routes');
const postRoutes = require('../post/post.routes');

// Auth Routes
router.use('/auth', authRoutes);

// User Routes
router.use('/user', userRoutes);

// Post Routes
router.use('/post', postRoutes);

// Test Route for Checking whether the app is working or not
router.use('/test', (req, res) => {
  res.send('Hello world');
});

router.use((req, res) => res.status(404).json('No API route found'));

module.exports = router;
