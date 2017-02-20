var express = require('express');
var router = express.Router();
var encryptor = require('../backend/crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  var encryptedObj = encryptor("my message", "backend/keys/public/public-key-1");
  console.log(encryptedObj);
  res.render('index', { title: 'Mining for Goldstein' });
});

module.exports = router;
