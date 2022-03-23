// External Import
const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Comment Model
const Comment = mongoose.model('Comment', CommentSchema);

// Export Comment Model
module.exports = Comment;
