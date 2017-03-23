const mongoose = require('mongoose');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

/*
* Creates a new chat into the database.
* 
* @param   {Object}   res
* @param   {Object}   messageObj
* @return  {ObjectID} thisUserID
*/
const createNewChat = (res, messageObj, thisUserID) => {
  const chatID = [thisUserID, messageObj.otherUserID].sort().join(":");

  // Check database to see if the chatID already exists.
  Chat.findOne({ chatID: chatID }, (err, chat) => {
    if(err)
      res.status(500).send({ error: err });

    // Do not create a new chat if chat already exists.
    if(chat)
      res.status(422).send("Chat already exists");

    // If chat does not exist, create a new chat with a message.
    else {
      // New Chat object
      const newChat = new Chat({
        chatID: chatID,
        users: [thisUserID, messageObj.otherUserID]
      });

      // Saves new chat into database, then calls callback
      newChat.save((err) => {
        if(err) 
          res.status(500).send({ error: err });

        // New Message object of first message in chat
        const firstMessage = new Message({
          _creator: newChat._id,
          senderID: thisUserID,
          receiverID: messageObj.otherUserID,
          timeStamp: Date.now(),
          isRead: false,
          message: JSON.stringify(messageObj.message)
        });

        // Save the new message into the database, then calls callback
        firstMessage.save((err) => {
          if(err)
            res.status(500).json({ error: err });
          
          // If no errors, push new message into the chat.
          newChat.messages.push(firstMessage);
          newChat.save((err) => {
            if(err)
              res.status(500).send("Unable to create new chat");

            res.status(201).send("New Chat created successfully");
          });
        });
      });
    }
  });
};

/*
* Gets chat between two users.
* 
* @param   {Object}   res
* @param   {Object}   res
* @return  {Function} next
*/
exports.getChat = (req, res, next) => {
  // Check if user is verified.
  if(req.user) {
    const thisUserID = req.user._id;
    const otherUserID = req.params.otherUserID;
    const chatID = [thisUserID, otherUserID].sort().join(":");

    // Find chatID in database, and grab all the messages
    // connected to that chatID.
    Chat
      .findOne({ chatID: chatID })
      .populate('messages')
      .exec((err, chat) => {
        if(err)
          res.status(500).send({ error: err });
        if(chat) {
          res.status(200).json(chat.messages);
        } else {
          res.status(422).send({ error: 'Could not find chat' });
        }
      });
  }
};

// Updates chat between two users
exports.putChat = (req, res, next) => {
  if(req.user) {
    const thisUserID = req.user._id;
    const otherUserID = req.body.otherUserID;
    const chatID = [thisUserID, otherUserID].sort().join(":");
    console.log("chatID: " + chatID);

    Chat.findOne({ chatID: chatID }, (err, chat) => {
      if(err)
        res.status(500).send({ error: err });

      if(chat) {
        const newMessage = new Message({
          _create: chat._id,
          senderID: thisUserID,
          receiverID: req.body.otherUserID,
          timeStamp: Date.now(),
          isRead: false,
          message: JSON.stringify(req.body.message)
        });

        newMessage.save((err) => {
          if(err)
            res.status(500).send({ error: err });

          Chat.findOneAndUpdate(
            { chatID: chatID },
            { $push: {"messages": newMessage} },
            { safe: true, upsert: true, new: true },
            function(err, chat) {
              if(err)
                res.status(500).send({ error: err });
            });
        });
        
        res.status(200).send("Good");
      }
      else
        res.status(422).send({ error: 'Could not find chat' });
    });
  }
};

// Creates new chat between two users
exports.postChat = (req, res, next) => {
  // Check if user is verified
  if(req.user) {
    const thisUserID = req.user._id;
    
    // Extract encrypted message object from request
    const messageObj = req.body;

    if(!messageObj)
      res.status(422).send({ error: 'Message must be provided' });

    if(!messageObj.otherUserID)
      res.status(422).send({ error: 'Message must be sent to another user' });

    if(!messageObj.message)
      res.status(422).send({ error: 'Message must be provided' });

    createNewChat(res, messageObj, thisUserID);
  }
};