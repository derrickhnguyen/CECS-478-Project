var express = require('express');
var router = express.Router();
var encryptorAndDecryptor = require('../crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  var encryptedObj = encryptorAndDecryptor.encryptor("my message", "backend/keys/public/public");
  var decryptedMsg = encryptorAndDecryptor.decryptor(encryptedObj, "backend/keys/private/private");
  console.log("Encrypted Message: " + encryptedObj);
  console.log("Decrypted Message: " + decryptedMsg);
  res.render('index', { title: 'Mining for Goldstein' });
});

router.get('/message', function(req, res, next) {

});

router.post('/message', function(req, res, next) {

});

module.exports = router;
