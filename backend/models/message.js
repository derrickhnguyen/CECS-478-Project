const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  isRead: { type: Boolean, required: true },
  message: { type: String, required: true }
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;