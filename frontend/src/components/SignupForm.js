import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Button, Spinner, ErrorMessage } from './common'
import {
  authFirstNameChanged,
  authLastNameChanged,
  authEmailChanged,
  authPasswordChanged,
  signupUser
} from '../actions'

/*
* Component that displays the Signup Form Page.
*/
class SignupForm extends Component {
  // Whenever firstname input changes, this function
  // will be called to change the firstname input state.
  // ../actions/AuthActions/onFirstNameChange
  onFirstNameChange(text) {
    this.props.authFirstNameChanged(text)
  }

  // Whenever lastname input changes, this function
  // will be called to change the lastname input state.
  // ../actions/AuthActions/onLastNameChange
  onLastNameChange(text) {
    this.props.authLastNameChanged(text)
  }

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
  // will be called to invoke the signupUser function.
  // ../actions/AuthActions/signupUser
  onButtonPress() {
    const { firstname, lastname, email, password } = this.props
    this.props.signupUser({ firstname, lastname, email, password })
  }

  // Helper function to render either the spinner
  // or the button.
  renderButton() {
    if (this.props.loading) {
      return <Spinner size='large' />
    } else {
      return (
        <Button onPress={this.onButtonPress.bind(this)}>
          Sign Up
        </Button>
      )
    }
  }

  // Main function to render Login Form page.
  render() {
    // Extract states from props object.
    const { firstname, lastname, email, password, authError } = this.props

    return (
      <Card>
        <CardSection>
          <Input
            placeholder='First Name'
            onChangeText={this.onFirstNameChange.bind(this)}
            value={firstname}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder='Last Name'
            onChangeText={this.onLastNameChange.bind(this)}
            value={lastname}
          />
        </CardSection>
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
      </Card>
    )
  }
}

// Extract states from auth reducer,
// and use it for this page.
const mapStateToProps = ({ auth }) => {
  const {
    firstname,
    lastname,
    email,
    password,
    authError,
    loading
  } = auth

  return {
    firstname,
    lastname,
    email,
    password,
    authError,
    loading
  }
}

// Connects this page with redux so states can be
// used from auth.
//
// Exports SignupForm.js to be used for application.
export default connect(mapStateToProps, {
  authFirstNameChanged,
  authLastNameChanged,
  authEmailChanged,
  authPasswordChanged,
  signupUser
})(SignupForm)