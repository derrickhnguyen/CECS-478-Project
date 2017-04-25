const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define our model
const messageSchema = new Schema({
  _creator    : { type: Schema.Types.ObjectId, ref: 'chat' },
  senderID    : { type: Schema.Types.ObjectId, ref: 'user', required: true },
  receiverID  : { type: Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp   : { type: Date, default: Date.now, required: true },
  isRead      : { type: Boolean, required: true },
  message     : { type: String, required: true }
})

// Create the model class
const Message = mongoose.model('message', messageSchema)

// Export the model
module.exports = Message