// External Dependencies
const mongoose = require('mongoose');

// Mongoose Schema
const Schema = mongoose.Schema;

// Message Schema
const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    body: { type: String, max: 700, default: '' },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

// Export the model
module.exports = Message;

// This is comment
