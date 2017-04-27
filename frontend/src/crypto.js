import AES  from 'crypto-js/aes'
import SHA256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import RSAKey from 'react-native-rsa'
import { randomBytes } from 'react-native-randombytes'

/*
* Encrypts message with AES Key. Retrieves tag with SHA256 Key. 
* Encrypts concatenated AES Key and SHA256 Key with RSA Key. 
* 
* @param   {String} message
* @param   {String} path
* @return  {JSON}
*/
exports.encryptor = (message, publicKey) => {
  // Generates random 32 and 16 byte keys for AES and IV, respectively.
  const AESKey = randomBytes(32).toString('hex')
  const IV = randomBytes(16).toString('hex')

  // Generates AES object by passing in the message, AES key and IV,
  // and parses out ciphertext from the object.
  const AESObj = AES.encrypt(message, AESKey, {IV: IV})
  const AESCipherText = AESObj.ciphertext.toString()

  // Generates random 32 byte key for HMAC, and creates a tag by passing
  // in the ciphertext and the gernerated key.
  const SHA256Key = randomBytes(32).toString('hex')
  const SHA256Tag = CryptoJS.HmacSHA256(AESCipherText, SHA256Key).toString()

  // Concatenates key for RSA encryption.
  const concatenatedKey = AESKey + SHA256Key
  const rsa = new RSAKey()
  rsa.setPublicString(publicKey)
  const RSACipherText = rsa.encrypt(concatenatedKey)

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
exports.decryptor = (encryptJSONObj, privateKey) => {
  // Parse out information from object.
  const encryptObj = JSON.parse(encryptJSONObj)
  const AESObjString = encryptObj.aesObjString
  const RSACipherText = encryptObj.rsaCipherText
  const AESCipherText = encryptObj.aesCipherText
  const SHA256OldTag = encryptObj.hmacTag

  // Decrypts the encrypted concatenated key by passing in the RSA key.
  const rsa = new RSAKey()
  rsa.setPrivateString(privateKey)
  const concatenatedKey = rsa.decrypt(RSACipherText)

  // Splits the two keys (AES key + HMAC key) apart.
  if(concatenatedKey) {
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
  } else {
    return null
  }
}