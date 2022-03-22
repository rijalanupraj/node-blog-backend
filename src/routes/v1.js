// External Import
const router = require('express').Router();

// Test Route for Checking whether the app is working or not
router.use('/test', (req, res) => {
  res.send('Hello world');
});

module.exports = router;
