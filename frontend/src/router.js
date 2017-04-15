import React from 'react'
import { Scene, Router, Actions } from 'react-native-router-flux'
import LoginForm from './components/LoginForm'
import ChatList from './components/ChatList'
import ChatCreate from './components/ChatCreate'

const RouterComponent = () => {
  return (
    <Router sceneStyle={{ paddingTop: 65 }}>
      <Scene key='auth'>
        <Scene key='login' component={LoginForm} title='M4G' />
      </Scene>

      <Scene key='main'>
        <Scene
          onRight={() => Actions.chatCreate()}
          rightTitle='Add'
          key='chatList'
          component={ChatList}
          title='M4G'
          initial
        />
        <Scene
          key='chatCreate'
          component={ChatCreate}
          title='Create Chat'
        />
      </Scene>
    </Router>
  )
}

export default RouterComponent