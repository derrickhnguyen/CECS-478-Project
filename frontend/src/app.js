import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import Router from './router'
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

// Make const storage into a global scope.
global.storage = storage
global.PRIVATE_KEY_STRING = 'privateKey'
global.EMPTY_STATE = ''

class App extends Component {

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

export default App