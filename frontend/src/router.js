import React from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Loginform from './components/LoginForm'

const RouterComponent = () => {
  return (
    <Router>
      <Scene key='login' component={LoginForm} title='Please Login' />
    </Router>
  )
}

export default RouterComponent