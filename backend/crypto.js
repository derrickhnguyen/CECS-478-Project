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

  // Generates random 32 and 16 byte keys for AES and IV, respectively.
  const AESKey = CryptoNode.randomBytes(32).toString('hex');
  const IV = CryptoNode.randomBytes(16).toString('hex');

  // Generates AES object by passing in the message, AES key and IV,
  // and parses out ciphertext from the object.
  let AESObj = AES.encrypt(message, AESKey, {IV: IV});
  let AESCipherText = AESObj.ciphertext.toString();

  // Generates random 32 byte key for HMAC, and creates a tag by passing
  // in the ciphertext and the gernerated key.
  let SHA256Key = CryptoNode.randomBytes(32).toString('hex');
  let SHA256Tag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString();

  // Concatenates key for RSA encryption.
  let concatenatedKey = AESKey + SHA256Key;

  // Loads the RSA key.
  let RSAKeyText = fs.readFileSync(publicKeyPath, 'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    }
  });

  // Converts concatenated string into a Buffer object to pass in as a 
  // parameter for RSA encryption. 
  let concatenatedKeyBuffer = Buffer.from(concatenatedKey);

  // Encrypts concatenated key (AES key + HMAC key) by passing in the RSA key.
  let RSACipherText = CryptoNode.publicEncrypt(RSAKeyText, concatenatedKeyBuffer);

  // Object to return
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

  // Parse out information from object.
  let encryptObj = JSON.parse(encryptJSONObj);
  let AESObjString = encryptObj.aesObjString;
  let RSACipherText = encryptObj.rsaCipherText;
  let AESCipherText = encryptObj.aesCipherText;
  let SHA256OldTag = encryptObj.hmacTag;

  // Load RSA key.
  let RSAKeyText = fs.readFileSync(privateKeyPath, 'utf8', function(err, datta) {
    if(err) {
      return console.log(err);
    }
  });
 
  // Converts RSACipherText (String) into a Buffer Object.
  let RSACipherTextBuffer = Buffer.from(RSACipherText);

  // Decrypts the encrypted concatenated key by passing in the RSA key.
  let concatenatedKeyBuffer = CryptoNode.privateDecrypt(RSAKeyText, RSACipherTextBuffer);

  let concatenatedKey = concatenatedKeyBuffer.toString();

  // Splits the two keys (AES key + HMAC key) apart.
  let concatenatedKeyArray = concatenatedKey.split("");
  let AESKey = concatenatedKeyArray.splice(0, concatenatedKeyArray.length / 2).join("");
  let SHA256Key = concatenatedKeyArray.join("");

  // Generates HMAC tag by passing in ciphertext and HMAC key.
  let SHA256NewTag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString();

  // Compare tags.
  // If same, returns decrypted message.
  // else, throws error.
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