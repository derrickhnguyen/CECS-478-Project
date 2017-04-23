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
          <Scene 
            navigationBarStyle={{backgroundColor:'#778899'}}
            titleStyle={{color:'white'}}
            key='login'
            component={LoginForm}
            leftButtonIconStyle={{tintColor:'white'}}
            title='M4G' />
          <Scene
            navigationBarStyle={{backgroundColor:'#778899'}}
            titleStyle={{color:'white'}} 
            onBack={this.onBackButtonClick.bind(this)}
            key='signup'
            component={SignupForm}
            leftButtonIconStyle={{tintColor:'white'}}
            title='Sign Up' />
        </Scene>
        <Scene key='main'>
          <Scene
            navigationBarStyle={{backgroundColor:'#778899'}}
            titleStyle={{color:'white'}}
            onRight={() => Actions.chatCreate()}
            rightTitle='Add'
            rightButtonTextStyle={{color:'white'}}
            key='chatList'
            component={ChatList}
            leftButtonIconStyle={{tintColor:'white'}}
            title='Welcome'
          />
          <Scene
            navigationBarStyle={{backgroundColor:'#778899'}}
            titleStyle={{color:'white'}} 
            key='chatCreate'
            component={ChatCreate}
            leftButtonIconStyle={{tintColor:'white'}}
            title='Create chat'
          />
        </Scene>
      </Router>
    )
  }
}

export default connect(null, { signupLeftClicked })(RouterComponent)