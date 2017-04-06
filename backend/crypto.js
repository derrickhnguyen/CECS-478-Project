const AES = require("crypto-js/aes")
const SHA256 = require("crypto-js/sha256")
const CryptoJS = require("crypto-js")
const CryptoNode = require('crypto')
const fs = require("fs")

/*
* Encrypts message with AES Key. Retrieves tag with SHA256 Key. 
* Encrypts concatenated AES Key and SHA256 Key with RSA Key. 
* 
* @param   {String} message
* @param   {String} path
* @return  {JSON}
*/
exports.encryptor = (message, publicKeyPath) => {
  // Generates random 32 and 16 byte keys for AES and IV, respectively.
  const AESKey = CryptoNode.randomBytes(32).toString('hex')
  const IV = CryptoNode.randomBytes(16).toString('hex')

  // Generates AES object by passing in the message, AES key and IV,
  // and parses out ciphertext from the object.
  const AESObj = AES.encrypt(message, AESKey, {IV: IV})
  const AESCipherText = AESObj.ciphertext.toString()

  // Generates random 32 byte key for HMAC, and creates a tag by passing
  // in the ciphertext and the gernerated key.
  const SHA256Key = CryptoNode.randomBytes(32).toString('hex')
  const SHA256Tag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString()

  // Concatenates key for RSA encryption.
  const concatenatedKey = AESKey + SHA256Key

  // Loads the RSA key.
  const RSAKeyText = fs.readFileSync(publicKeyPath, 'utf8', (err, data) => {
    if (err)
      return console.log(err)
  })

  // Converts concatenated string into a Buffer object to pass in as a 
  // parameter for RSA encryption. 
  const concatenatedKeyBuffer = Buffer.from(concatenatedKey)

  // Encrypts concatenated key (AES key + HMAC key) by passing in the RSA key.
  // By default, this function uses OAEP Padding. Documentation can be found here:
  // https://nodejs.org/api/crypto.html#crypto_crypto_publicencrypt_public_key_buffer
  const RSACipherText = CryptoNode.publicEncrypt(RSAKeyText, concatenatedKeyBuffer)

  // Object to return
  const returnObj = {
    aesObjString: AESObj.toString(),
    rsaCipherText: RSACipherText,
    aesCipherText: AESCipherText,
    hmacTag: SHA256Tag
  }

  return JSON.stringify(returnObj)
}

/*
* Decrypt concatenated key with private key. 
* Compare old SHA256 tag with new SHA256 tag. 
* Decrypt message with AESKey. 
*
* @param {JSON}   encryptJSONObj
* @param {String} privateKeyPath
*/
exports.decryptor = (encryptJSONObj, privateKeyPath) => {
  // Parse out information from object.
  const encryptObj = JSON.parse(encryptJSONObj)
  const AESObjString = encryptObj.aesObjString
  const RSACipherText = encryptObj.rsaCipherText
  const AESCipherText = encryptObj.aesCipherText
  const SHA256OldTag = encryptObj.hmacTag

  // Load RSA key.
  const RSAKeyText = fs.readFileSync(privateKeyPath, 'utf8', (err, datta) => {
    if (err)
      return console.log(err)
  })
 
  // Converts RSACipherText (String) into a Buffer Object.
  const RSACipherTextBuffer = Buffer.from(RSACipherText)

  // Decrypts the encrypted concatenated key by passing in the RSA key.
  const concatenatedKeyBuffer = CryptoNode.privateDecrypt(RSAKeyText, RSACipherTextBuffer)

  const concatenatedKey = concatenatedKeyBuffer.toString()

  // Splits the two keys (AES key + HMAC key) apart.
  const concatenatedKeyArray = concatenatedKey.split("")
  const AESKey = concatenatedKeyArray.splice(0, concatenatedKeyArray.length / 2).join("")
  const SHA256Key = concatenatedKeyArray.join("")

  // Generates HMAC tag by passing in ciphertext and HMAC key.
  const SHA256NewTag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString()

  // Compare tags.
  // If same, returns decrypted message.
  // else, throws error.
  if (SHA256NewTag === SHA256OldTag) {
    const AESDecryptObj = AES.decrypt(AESObjString, AESKey)
    return AESDecryptObj.toString(CryptoJS.enc.Utf8)
  } else {
    throw 'Unable to decrypt message!'
  }
}