const Chat = require('../models/chat');

exports.getChat = function(req, res, next) {
  
};

exports.postChat = function(req, res, next) {
  const senderID = req.body.senderID;
  const receiverID = req.body.receiverID;
  const timestamp = req.body.timestamp;
  const isRead = req.body.isRead;
  const encryptedObj = req.body.encryptedObj;

  const chat = new Chat({
    senderID: senderID,
    receiverID: receiverID,
    timestampt: timestamp,
    isRead: isRead,
    encryptedObj: encryptedObj
  })

  chat.save(function(err) {
    if(err) return next(err);
  });
};