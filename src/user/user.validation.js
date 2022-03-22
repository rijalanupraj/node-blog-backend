// External Import
const Joi = require('joi');

const UserValidation = Joi.object({
  username: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = UserValidation;
