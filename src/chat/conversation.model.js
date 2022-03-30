// External Dependencies
const mongoose = require('mongoose');

// Mongoose Schema
const Schema = mongoose.Schema;

// Conversation Schema
const ConversationSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    participant: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);

// Export the model
module.exports = Conversation;
