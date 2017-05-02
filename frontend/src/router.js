import React, { Component } from 'react'
import { Scene, Router, Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import TimerMixin from 'react-timer-mixin'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ChatList from './components/ChatList'
import ChatCreate from './components/ChatCreate'
import FocusChat from './components/FocusChat'
import KeyForm from './components/KeyForm'
import { signupLeftClicked, removeFocusChatIntervalId, renderList, setChatListIntervalId } from './actions'

class RouterComponent extends Component {
  // Declare variables for every function in this class
  // to use.
  constructor(props) {
    super(props)
    this.mixins = [TimerMixin]
  }

  // When Signup back button is clicked, the function
  // will be called, then pop out of the page.
  onSignupBackButtonClick() {
    this.props.signupLeftClicked()
    Actions.pop()
  }

  // When Focus chat back button is clicked, the function
  // will be called, then pop out of the page.
  onFocusChatBackButtonClick() {
    const { focusChatIntervalId, token, userId } = this.props
    clearInterval(focusChatIntervalId)
    this.props.removeFocusChatIntervalId({ focusChatIntervalId })

    let chatListIntervalId = setInterval(() => {
      this.props.renderList({ token, userId })
    }, 6000)

    this.props.setChatListIntervalId({ chatListIntervalId })

    Actions.pop()
  }

  // Main function to render all the routers.
  render() {
    // Extract object within the styles object.
    const { backgroundStyle, textStyle, iconStyle } = styles

    return (
      <Router sceneStyle={{ paddingTop: 65 }}>
        <Scene key='auth'>
          <Scene 
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle}
            key='login'
            component={LoginForm}
            leftButtonIconStyle={iconStyle}
            title='M4G' />
          <Scene
            navigationBarStyle={backgroundStyle}
            titleStyle={textStyle} 
            onBack={this.onSignupBackButtonClick.bind(this)}
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
            onBack={this.onFocusChatBackButtonClick.bind(this)}
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

// Styles property.
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

// Extract states from auth and focusChat reducer,
// and use it for this page.
const mapStateToProps = ({ auth, focusChat }) => {
  const { hideBackImage, token, userId } = auth
  const { focusChatIntervalId } = focusChat
  return { hideBackImage, focusChatIntervalId, token, userId }
}

// Connects this page with redux so states can be
// used from auth and focusChat.
//
// Exports router.js to be used for application.
export default connect(mapStateToProps, {
  signupLeftClicked,
  removeFocusChatIntervalId,
  setChatListIntervalId,
  renderList
})(RouterComponent)