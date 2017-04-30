import React, { Component } from 'react'
import { Scene, Router, Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ChatList from './components/ChatList'
import ChatCreate from './components/ChatCreate'
import FocusChat from './components/FocusChat'
import KeyForm from './components/KeyForm'
import { signupLeftClicked } from './actions'

class RouterComponent extends Component {
  onBackButtonClick() {
    this.props.signupLeftClicked()
    Actions.pop()
  }

  render() {
    const { backgroundStyle, textStyle, iconStyle } = styles

    return (
      <Router sceneStyle={{ paddingTop: 65 }}>
        <Scene key='auth'>
          <Scene 
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle}
            key='login'
            component={LoginForm}
            leftButtonIconStyle={{tintColor:'white'}}
            title='M4G' />
          <Scene
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle} 
            onBack={this.onBackButtonClick.bind(this)}
            key='signup'
            component={SignupForm}
            leftButtonIconStyle={iconStyle}
            title='Sign Up'
            hideBackImage={this.props.hideBackImage} />
        </Scene>
        <Scene key='main'>
          <Scene
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle}
            onRight={() => Actions.chatCreate()}
            rightTitle='Add'
            rightButtonTextStyle={textStyle}
            key='chatList'
            component={ChatList}
            leftButtonIconStyle={iconStyle}
            title='Welcome'
          />
          <Scene
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle} 
            key='chatCreate'
            component={ChatCreate}
            leftButtonIconStyle={iconStyle}
            title='Create chat'
          />
          <Scene
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle}
            onRight={() => Actions.keyForm()}
            rightTitle='Add Keys'
            rightButtonTextStyle={textStyle}
            key='focusChat'
            component={FocusChat}
            leftButtonIconStyle={iconStyle}
          />
          <Scene
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle}
            key='keyForm'
            component={KeyForm}
            leftButtonIconStyle={iconStyle}
            title='Key Form'
          />
        </Scene>
      </Router>
    )
  }
}

const styles = {
  backgroundStyle: {
    backgroundColor: '#778899'
  },
  textStyle: {
    color: 'white'
  },
  iconStyle: {
    tintColor: 'white'
  }
}

const mapStateToProps = ({ auth }) => {
  const { hideBackImage } = auth
  return { hideBackImage }
}

export default connect(null, { signupLeftClicked })(RouterComponent)