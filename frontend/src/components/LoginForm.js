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
    const { signUpContainer, signUpStyle } = styles
    const { email, password, error } = this.props

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
        <ErrorMessage error={error} />
        <CardSection>
          {this.renderButton()}
        </CardSection>
        <CardSection>
          <View style={signUpContainer}>
            <Text style={signUpStyle}>
              Don't have an account? Sign up <Text style={{color: 'blue'}} onPress={this.onSignupClick.bind(this)}>here</Text>
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
    textAlign: 'center'
  }
})

const mapStateToProps = ({ auth }) => {
  const { email, password, error, loading } = auth
  return {
    email,
    password,
    error,
    loading
  }
}

export default connect(mapStateToProps, {
  authEmailChanged,
  authPasswordChanged,
  loginUser,
  signupClicked
})(LoginForm)