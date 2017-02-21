let AES = require("crypto-js/aes");
let SHA256 = require("crypto-js/sha256");
let CryptoJS = require("crypto-js");
let CryptoNode = require('crypto');
let fs = require("fs");

/*
* Encrypts message with AES Key. Retrieves tag with SHA256 Key. 
* Encrypts concatenated AES Key and SHA256 Key with RSA Key. 
* 
* @param   {String} message
* @param   {String} path
* @return  {JSON}
*/
let encryptor = function encryptor(message, publicKeyPath) {
  const AESKey = CryptoNode.randomBytes(32).toString('hex');

  let AESObj = AES.encrypt(message, AESKey);
  let AESCipherText = AESObj.ciphertext.toString();

  let SHA256Key = CryptoNode.randomBytes(32).toString('hex');
  let SHA256Tag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString();

  let concatenatedKey = AESKey + SHA256Key;

  let RSAKeyText = fs.readFileSync(publicKeyPath, 'utf8', function(err, datta) {
    if(err) {
      return console.log(err);
    }
  });

  let concatenatedKeyBuffer = Buffer.from(concatenatedKey);
  let RSACipherText = CryptoNode.publicEncrypt(RSAKeyText, concatenatedKeyBuffer);

  let returnObj = {
    aesObjString: AESObj.toString(),
    rsaCipherText: RSACipherText,
    aesCipherText: AESCipherText,
    hmacTag: SHA256Tag
  };

  return JSON.stringify(returnObj);
}

/*
* Decrypt concatenated key with private key. 
* Compare old SHA256 tag with new SHA256 tag. 
* Decrypt message with AESKey. 
*
* @param {JSON}   encryptJSONObj
* @param {String} privateKeyPath
*/
let decryptor = function decryptor(encryptJSONObj, privateKeyPath) {
  let encryptObj = JSON.parse(encryptJSONObj);
  let AESObjString = encryptObj.aesObjString;
  let RSACipherText = encryptObj.rsaCipherText;
  let AESCipherText = encryptObj.aesCipherText;
  let SHA256OldTag = encryptObj.hmacTag;

  let RSAKeyText = fs.readFileSync(privateKeyPath, 'utf8', function(err, datta) {
    if(err) {
      return console.log(err);
    }
  });
 
  let RSACipherTextBuffer = Buffer.from(RSACipherText);
  let concatenatedKeyBuffer = CryptoNode.privateDecrypt(RSAKeyText, RSACipherTextBuffer);
  let concatenatedKey = concatenatedKeyBuffer.toString();
  let concatenatedKeyArray = concatenatedKey.split("");

  let AESKey = concatenatedKeyArray.splice(0, concatenatedKeyArray.length / 2).join("");
  let SHA256Key = concatenatedKeyArray.join("");
  let SHA256NewTag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString();

  if(SHA256NewTag === SHA256OldTag) {
    let AESDecryptObj = AES.decrypt(AESObjString, AESKey);
    return AESDecryptObj.toString(CryptoJS.enc.Utf8);
  } else {
    throw 'Unable to decrypt message!';
  }
}

module.exports = {
  encryptor: encryptor,
  decryptor: decryptor
};