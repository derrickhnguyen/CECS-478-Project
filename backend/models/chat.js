const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  senderID: { type: Schema.Types.ObjectId, required: true },
  receiverID: { type: Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  isRead: { type: Boolean, required: true },
  encryptedObj: { type: String, required: true }
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;