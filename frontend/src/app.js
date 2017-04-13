import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { Header } from './components/common' 
import LoginForm from './components/LoginForm'

class App extends Component {

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))
    return (
      <Provider store={store}>
        <Header headerText='M4G' />
        <LoginForm />
      </Provider>
    )
  }
}

export default App