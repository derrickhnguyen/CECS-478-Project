import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Button, Card, CardSection, Input, Spinner, ErrorMessage } from './common'
import { authEmailChanged, authPasswordChanged, loginUser, signupClicked } from '../actions'

class LoginForm extends Component {
  onEmailChange(text) {
    this.props.authEmailChanged(text)
  }

  onPasswordChange(text) {
    this.props.authPasswordChanged(text)
  }

  onButtonPress() {
    const { email, password } = this.props
    this.props.loginUser({ email, password })
  }

  onSignupClick() {
    this.props.signupClicked()
  }

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

  render() {
    const { signUpContainer, signUpStyle, innerSignUpStyle } = styles
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

const mapStateToProps = ({ auth }) => {
  const { email, password, authError, loading } = auth
  return {
    email,
    password,
    authError,
    loading
  }
}

export default connect(mapStateToProps, {
  authEmailChanged,
  authPasswordChanged,
  loginUser,
  signupClicked
})(LoginForm)