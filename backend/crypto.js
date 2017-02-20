let AES = require("crypto-js/aes");
let SHA256 = require("crypto-js/sha256");
let CryptoJS = require("crypto-js");
let NodeRSA = require ("node-rsa");
let CryptoNode = require('crypto');
let fs = require("fs");

/**
* Encrypts message with AES Key. Retrieves tag with
* SHA256 Key. Encrypts concatenated AES Key and SHA256 
* Key with RSA Key. 
* 
* @param   {String} message
* @param   {String} path
* @return  {Object}
*/
let encryptor = function encryptor(message, path) {
  const passphrase = "CECS478SemesterProject";
  
  let AESObj = AES.encrypt(message, passphrase);
  let AESKey = AESObj.key.toString();
  let AESCipherText = AESObj.ciphertext.toString();

  let SHA256Key = CryptoNode.randomBytes(32).toString('hex');
  let SHA256Tag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString();

  let concatenatedKey = AESKey + SHA256Key;

  let RSAKeyText = fs.readFileSync(path, 'utf8', function(err, datta) {
    if(err) {
      return console.log(err);
    }
  });

  let RSAParameters = [RSAKeyText, ['pkcs1']];
  let RSAKey = new NodeRSA(RSAParameters);
  let RSACipherText = RSAKey.encrypt(concatenatedKey, ['base64'], ['utf8']);

  let returnObj = {
    rsaCipherText: RSACipherText,
    aesCipherText: AESCipherText,
    hmacTag: SHA256Tag
  };

  return returnObj;
}

module.exports = encryptor;