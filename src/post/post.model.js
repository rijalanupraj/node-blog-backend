// External Import
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// Schema
const Schema = mongoose.Schema;

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

PostSchema.plugin(URLSlugs('title', { field: 'slug' }));

// Post Model
const Post = mongoose.model('Post', PostSchema);

// Export Post Model
module.exports = Post;
