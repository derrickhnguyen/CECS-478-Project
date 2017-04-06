const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
	chatID   :  { type: String, required: true },
	users    : [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
	messages : [{ type:Schema.Types.ObjectId, ref: "message", required: true }]
})

const Chat = mongoose.model('chat', chatSchema)

module.exports = Chat