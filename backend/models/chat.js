const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users" // ✅ Refers to User model
    }
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "message" // ✅ Refers to Message model
  },
  unreadMessageCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema); // ✅ Model name: Chat
