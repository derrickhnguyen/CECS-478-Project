import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import Router from './router'

/*
* Component that renders the entire application.
* This component is render from ../index.android.js
*/
class App extends Component {
  render() {
    // Connects the store of reducers to the application to be used.
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

// Export App.js to be used for application.
export default App