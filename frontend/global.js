import { AsyncStorage } from 'react-native'
import Storage from 'react-native-storage'

// Local storage to store messages and
// public/private keys.
const storage = new Storage({
  // Maxiumum capacity
  size: 1000,

  // Use AsyncStorage for React Native,
  // If not set, data would be lost after reload.
  storageBackend: AsyncStorage,

  // Expire time,
  // null = never expires.
  defaultExpires: null,

  // Cache data in the memory.
  enableCache: true
})

module.exports = {
  storage: storage,
  PRIVATE_KEY_STRING: 'privateKey',
  PUBLIC_KEY_STRING: 'publicKey',
  EMPTY_STATE: ''
}