var express = require('express');
var router = express.Router();
var encryptor = require('../backend/crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  encryptor("my message", "backend/keys/public/public-key-1");
  res.render('index', { title: 'Mining for Goldstein' });
});

module.exports = router;
