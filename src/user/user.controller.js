// Internal Import
const User = require('../user/user.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');

// Register User
const getCurrentUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if (!user) {
    return next(new ExpressError('User not found', 404));
  }

  const userData = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  res.status(200).json({
    success: true,
    user: userData
  });
});

module.exports = {
  getCurrentUser
};
