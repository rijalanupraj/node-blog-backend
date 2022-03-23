// External Import
const mongoId = require('mongoose').Types.ObjectId;

// Internal Import
const User = require('../user/user.model');
const Category = require('./category.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');

// Create New Post
const createCategory = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { name } = req.body;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User not found', 404));
  }

  const newCategory = new Category({ name });
  const savedCategory = await newCategory.save();

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category: savedCategory
  });
});

// Get All Categories

const getAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    message: 'Category list',
    categories
  });
});

module.exports = {
  createCategory,
  getAllCategories
};
