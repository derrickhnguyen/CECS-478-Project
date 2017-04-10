import React, { Component } from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers'
import { Header } from './components/common' 
import LoginForm from './components/LoginForm'

class App extends Component {

  render() {
    return (
      <Provider store={createStore(reducers)}>
        <View>
          <Header headerText='M4G' />
          <LoginForm />
        </View>
      </Provider>
    )
  }
}

export default App