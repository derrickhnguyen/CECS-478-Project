const Chat = require('../models/chat')
const Message = require('../models/message')

/*
* Creates a new chat into the database.
* 
* @param   {Object}   res
* @param   {Object}   messageObj
* @return  {ObjectID} thisUserID
*/
const createNewChat = (res, otherUserId, thisUserId) => {
  const chatID = [thisUserId, otherUserId].sort().join(":")

  // Check database to see if the Chat Object already exists
  // based on the chadID.
  Chat.findOne({ chatID: chatID }, (err, chat) => {
    // Send 500 status if there is an error.
    if (err) {
      res.status(500).send({ error: err })
    } else if (chat) {
      // Do not create a new chat if chat already exists.
      res.status(422).send({ error: 'This chat already exists' })
    } else {
      // If chat does not exist, create a new chat with a message.
      // Create a new Chat object.
      const newChat = new Chat({
        chatID: chatID,
        users: [thisUserId, otherUserId]
      })

      // Save the new Chat object into the database, and then
      // invoke the callback function.
      newChat.save((err) => {
        // Send 500 status if there is an error.
        if (err) {
          res.status(500).send({ error: err })
        } else {
          res.status(201).send('New chat created succesfully ')
        }
      })
    }
  })
}

/*
* Gets chat between two users.
* 
* @param   {Object}   req
* @param   {Object}   res
* @return  {Function} next
*/
exports.getChat = (req, res, next) => {
  // Check if user is verified.
  if (req.user) {
    // Get users' ID to create chadID.
    const thisUserID = req.user._id
    const otherUserID = req.params.otherUserID
    const chatID = [thisUserID, otherUserID].sort().join(":")

    // Find chatID in database, and grab all the messages
    // connected to that chatID.
    Chat
      .findOne({ chatID: chatID })
      .populate('messages')
      .exec((err, chat) => {
        if (err) {
          res.status(500).send({ error: err })
        } else if (chat) {
          res.status(200).send(chat.messages)
        } else {
          res.status(422).send({ error: 'Could not find chat' })
        }
      })
  }
}

exports.getAllChat = (req, res, next) => {
  if(req.user) {
    const thisUserID = req.user._id
    Chat.find({ chatID: {'$regex': thisUserID, '$options': 'i'} }, (err, chats) => {
      if (err) {
        res.status(500).send({ error: err })
      } else if (chats) {
        res.status(200).send(chats)
      } else {
        res.status(422).send({ error: 'Could not get chats' })
      }
    })
  }
}

/*
* Puts new message into chat between two users.
* 
* @param   {Object}   req
* @param   {Object}   res
* @return  {Function} next
*/
exports.putChat = (req, res, next) => {
  // Check if user is verified.
  if (req.user) {
    // Get users' ID to create chadID.
    const thisUserID = req.user._id
    const otherUserID = req.body.otherUserID
    const chatID = [thisUserID, otherUserID].sort().join(":")

    // Check database to see if the Chat Object already exists
    // based on the chadID.
    Chat.findOne({ chatID: chatID }, (err, chat) => {
      // Send 500 status if there is an error.
      if (err) {
        res.status(500).send({ error: err })
      } else if (chat) {
        // If there exists a chat, insert the new message into
        // that Chat object.
        // Create a new Message object.
        const newMessage = new Message({
          _create: chat._id,
          senderID: thisUserID,
          receiverID: req.body.otherUserID,
          timeStamp: Date.now(),
          isRead: false,
          message: JSON.stringify(req.body.message)
        })

        // Save the new Message object into the database, and then
        // invoke the callback function.
        newMessage.save((err) => {
          // Send 500 status if there is an error.
          if (err) {
            res.status(500).send({ error: err })
          } else {
            // Call a static function in the Chat model to find the
            // Chat object and pushes the new message into the Chat's
            // object messages array. Then, invoke the callback
            // function.
            Chat.findOneAndUpdate(
              { chatID: chatID },
              { $push: {"messages": newMessage} },
              { safe: true, upsert: true, new: true },
              function(err, chat) {
                // Send 500 status if there is an error.
                if (err) {
                  res.status(500).send({ error: err })
                } else
                  // Send 201 status to show message insertion was successful.
                  res.status(201).send("New message successfully saved to chat")
              }
            )
          }
        })
      } else
        // Send 422 status to indicate that Chat object was not found.
        res.status(422).send({ error: 'Could not find chat' })
    })
  }
}

/*
* Creates new chat between two users.
* 
* @param   {Object}   req
* @param   {Object}   res
* @return  {Function} next
*/
exports.postChat = (req, res, next) => {
  // Check if user is verified.
  if (req.user) {
    const thisUserId = req.user._id
    const otherUserId = req.body.otherUserID

    if (otherUserId && thisUserId != otherUserId) {
      createNewChat(res, otherUserId, thisUserId)
    } else {
      res.status(422).send({ error: 'You cannot have a message with yourself' })
    }
  }
}