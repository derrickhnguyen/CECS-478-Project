var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var NodeRSA = require ("node-rsa");
var CryptoNode = require('crypto');
var fs = require("fs");

let encryptor = function encryptor(message, path) {
  const passphrase = "CECS478SemesterProject";
  
  var AESObj = AES.encrypt(message, passphrase);
  var AESKey = AESObj.key.toString();
  var AESCipherText = AESObj.ciphertext.toString();

  var SHA256Key = CryptoNode.randomBytes(32).toString('hex');
  var SHA256Tag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString();
  var concatenatedKey = AESKey + SHA256Key;
  var RSAKeyText = fs.readFileSync(path, 'utf8', function(err, datta) {
    if(err) {
      return console.log(err);
    }
  });

  var RSAParameters = [RSAKeyText, ['pkcs1']];
  var RSAKey = new NodeRSA(RSAParameters);
  var RSACipherText = RSAKey.encrypt(concatenatedKey, ['base64'], ['utf8']);

  var returnObj = {
    rsaCipherText: RSACipherText,
    aesCipherText: AESCipherText,
    hmacTag: SHA256Tag
  };

  return returnObj; 
}

module.exports = encryptor;