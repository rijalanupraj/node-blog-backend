// External Import
const mongoId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

// Internal Import
const User = require('../user/user.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');
const cloudinary = require('../config/cloudinary');

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

// Update User
const updateUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid ID', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(8);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  const userData = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  res.status(200).json({
    success: true,
    user: userData,
    message: 'User updated successfully'
  });
});

// Delete User
const deleteUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid ID', 400));
  }
  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  await User.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get User By Id
const getUserById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid ID', 400));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new ExpressError('User not found', 404));
  }

  const userData = {
    id: user.id,
    username: user.username,
    followers: user.followers,
    followings: user.followings
  };

  return res.status(200).json({
    success: true,
    user: userData,
    message: 'User found successfully'
  });
});

// Follow User
const followUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const userId = req.params.id;
  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid ID', 400));
  }

  if (id === userId) {
    return next(new ExpressError('You cannot follow yourself', 400));
  }

  const currentUser = await User.findById(id);
  const userToFollow = await User.findById(userId);

  if (!currentUser || !userToFollow) {
    return next(new ExpressError('User not found', 404));
  }

  if (!currentUser.followings.includes(userId)) {
    await currentUser.updateOne({
      $push: {
        followings: userId
      }
    });

    await userToFollow.updateOne({
      $push: {
        followers: id
      }
    });
    return res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } else {
    return next(new ExpressError('User already followed', 403));
  }
});

// Unfollow User
const unFollowUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const userId = req.params.id;
  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid ID', 400));
  }

  if (id === userId) {
    return next(new ExpressError('You cannot unfollow yourself', 400));
  }

  const currentUser = await User.findById(id);
  const userToUnFollow = await User.findById(userId);

  if (!currentUser || !userToUnFollow) {
    return next(new ExpressError('User not found', 404));
  }

  if (currentUser.followings.includes(userId)) {
    await currentUser.updateOne({
      $pull: {
        followings: userId
      }
    });

    await userToUnFollow.updateOne({
      $pull: {
        followers: id
      }
    });
    return res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } else {
    return next(new ExpressError("You don't follow this user", 403));
  }
});

// Update User Profile Picture
const updateProfilePicture = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }
  const profileImage = req.file;

  let imageUrl = '';
  let imageKey = '';
  if (profileImage) {
    const result = await cloudinary.uploader.upload(profileImage.path, {
      folder: 'blogam/users'
    });
    imageUrl = result.secure_url;
    imageKey = result.public_id;
    if (findUser.profilePhoto.hasPhoto) {
      await cloudinary.uploader.destroy(findUser.profilePhoto.filename);
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        profilePhoto: {
          url: imageUrl,
          filename: imageKey,
          hasPhoto: true
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      user: {
        id: updateUser.id,
        username: updateUser.username,
        email: updateUser.email,
        profilePhoto: updateUser.profilePhoto,
        followers: updateUser.followers,
        followings: updateUser.followings
      }
    });
  }

  return next(new ExpressError('No Image Provided', 400));
});

// Delete User Profile Picture
const removeProfilePicture = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }
  if (!findUser.profilePhoto.hasPhoto) {
    return next(new ExpressError('No profile picture found', 400));
  }

  await cloudinary.uploader.destroy(findUser.profilePhoto.filename);
  findUser.profilePhoto = {
    url: '',
    filename: '',
    hasPhoto: false
  };
  await findUser.save();

  // Response
  res.status(200).json({
    success: true,
    message: 'Profile picture removed successfully',
    user: {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      profilePhoto: findUser.profilePhoto,
      followers: findUser.followers,
      followings: findUser.followings
    }
  });
});

module.exports = {
  getCurrentUser,
  updateUser,
  deleteUser,
  getUserById,
  followUser,
  unFollowUser,
  updateProfilePicture,
  removeProfilePicture
};
