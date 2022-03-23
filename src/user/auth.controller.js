// External Import
const jwt = require('jsonwebtoken');

// Internal Import
const User = require('../user/user.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');
const UserValidation = require('../user/user.validation');
const { JWT } = require('../config/keys');

// Register User
const registerUser = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;
  const { error } = UserValidation.validate(req.body);

  if (error) {
    return next(new ExpressError(error.details[0].message, 400));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    return next(new ExpressError('User already exists', 400));
  }

  const newUser = await User({ username, email, password });
  const registeredUser = await newUser.save();

  const payload = {
    id: registeredUser.id
  };

  const token = jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.TOKEN_LIFE });

  res.status(201).json({
    success: true,
    token: `${token}`,
    user: {
      id: registeredUser.id,
      username: registeredUser.username,
      email: registeredUser.email
    }
  });
});

// Login User
const loginUser = asyncWrapper(async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) return next(new ExpressError('Fill All Fields.', 400));

  const currentUser = await User.findOne({
    $or: [{ username: emailOrUsername }, { email: emailOrUsername }]
  });
  if (!currentUser) return next(new ExpressError('Wrong Credentials', 400));

  const isMatch = await currentUser.comparePassword(password, currentUser.password);
  if (!isMatch) return next(new ExpressError('Wrong Credentials', 400));

  const payload = {
    id: currentUser.id
  };

  const token = jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.TOKEN_LIFE });

  res.status(200).json({
    success: true,
    token: `${token}`,
    user: {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email
    }
  });
});

module.exports = {
  registerUser,
  loginUser
};
