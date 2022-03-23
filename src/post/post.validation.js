// External Import
const Joi = require('joi');

const PostValidation = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().valid('public', 'private'),
  allowComments: Joi.boolean()
});

module.exports = PostValidation;
