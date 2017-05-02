import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Button, Card, CardSection, Input, Spinner, ErrorMessage } from './common'
import { authEmailChanged, authPasswordChanged, loginUser, signupClicked } from '../actions'

/*
* Component that displays the Login Form Page.
*/
class LoginForm extends Component {
  // Whenever email input changes, this function
  // will be called to change the email input state.
  // ../actions/AuthActions/authEmailChanged
  onEmailChange(text) {
    this.props.authEmailChanged(text)
  }

  // Whenever password input changes, this function
  // will be called to change the password input state.
  // ../actions/AuthActions/authPasswordChanged
  onPasswordChange(text) {
    this.props.authPasswordChanged(text)
  }

  // Whenever the button is pressed, this function
  // will be called to invoke the loginUser function.
  // ../actions/AuthActions/loginUser
  onButtonPress() {
    const { email, password } = this.props
    this.props.loginUser({ email, password })
  }

  // If the right tab of the header is clicked,
  // this focus will invoke the signupClicked function
  // that will change to the Signup page.
  // ../actions/AuthActions/signupClicked
  onSignupClick() {
    this.props.signupClicked()
  }

  // Helper function that display either spinner,
  // or button.
  renderButton() {
    if (this.props.loading) {
      return <Spinner size='large' />
    } else {
      return (
        <Button onPress={this.onButtonPress.bind(this)}>
          Login
        </Button>
      )
    }
  }

  // Main function to render Login Form page.
  render() {
    // Extract object within the styles object.
    const { signUpContainer, signUpStyle, innerSignUpStyle } = styles

    // Extract states from props object.
    const { email, password, authError } = this.props

    return (
      <Card>
        <CardSection>
          <Input
            placeholder='Email'
            onChangeText={this.onEmailChange.bind(this)}
            value={email}
          />
        </CardSection>
        <CardSection>
          <Input
            secureTextEntry
            placeholder='Password'
            onChangeText={this.onPasswordChange.bind(this)}
            value={password}
          />
        </CardSection>
        <ErrorMessage error={authError} />
        <CardSection>
          {this.renderButton()}
        </CardSection>
        <CardSection>
          <View style={signUpContainer}>
            <Text style={signUpStyle}>
              Don't have an account? Sign up <Text style={innerSignUpStyle} onPress={this.onSignupClick.bind(this)}>here</Text>
            </Text>
          </View>
        </CardSection>
      </Card>
    )
  }
}

// Styles property.
const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  signUpStyle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20
  },
  innerSignUpStyle: {
    color: '#778899',
    fontWeight:'bold'
  }
})

// Extract states from auth reducer,
// and use it for this page.
const mapStateToProps = ({ auth }) => {
  const { email, password, authError, loading } = auth
  return {
    email,
    password,
    authError,
    loading
  }
}

// Connects this page with redux so states can be
// used from auth.
//
// Exports LoginForm.js to be used for application.
export default connect(mapStateToProps, {
  authEmailChanged,
  authPasswordChanged,
  loginUser,
  signupClicked
})(LoginForm)