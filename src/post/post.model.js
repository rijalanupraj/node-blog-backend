// External Import
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

// Schema
const Schema = mongoose.Schema;

// Slug Options
const options = {
  separator: '-',
  lang: 'en',
  truncate: 120
};
mongoose.plugin(slug, options);

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['public', 'private'],
      default: 'public'
    },
    slug: {
      type: String,
      slug: 'title',
      unique: true
    },
    image: {
      url: String,
      filename: String
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Post Model
const Post = mongoose.model('Post', PostSchema);

// Export Post Model
module.exports = Post;
