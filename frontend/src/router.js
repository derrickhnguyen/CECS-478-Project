import React, { Component } from 'react'
import { Scene, Router, Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ChatList from './components/ChatList'
import ChatCreate from './components/ChatCreate'
import { signupLeftClicked } from './actions'

class RouterComponent extends Component {
  onBackButtonClick() {
    this.props.signupLeftClicked()
    Actions.pop()
  }

  render() {
    return (
      <Router sceneStyle={{ paddingTop: 65 }}>
        <Scene key='auth'>
          <Scene key='login' component={LoginForm} title='M4G' />
          <Scene
            onBack={this.onBackButtonClick.bind(this)}
            key='signup'
            component={SignupForm}
            title='Sign Up' />
        </Scene>
        <Scene key='main'>
          <Scene
            onRight={() => Actions.chatCreate()}
            rightTitle='Add'
            key='chatList'
            component={ChatList}
            title='Welcome'
          />
          <Scene
            key='chatCreate'
            component={ChatCreate}
            title='Create chat'
          />
        </Scene>
      </Router>
    )
  }
}

export default connect(null, { signupLeftClicked })(RouterComponent)