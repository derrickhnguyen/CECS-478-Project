const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define our model
const chatSchema = new Schema({
	chatID   :  { type: String, required: true },
	users    : [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
	messages : [{ type:Schema.Types.ObjectId, ref: "message", required: true }]
})

// Create the model class
const Chat = mongoose.model('chat', chatSchema)

// Export the model
module.exports = Chat