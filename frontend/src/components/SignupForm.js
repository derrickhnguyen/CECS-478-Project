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

class SignupForm extends Component {
  onFirstNameChange(text) {
    this.props.authFirstNameChanged(text)
  }

  onLastNameChange(text) {
    this.props.authLastNameChanged(text)
  }

  onEmailChange(text) {
    this.props.authEmailChanged(text)
  }

  onPasswordChange(text) {
    this.props.authPasswordChanged(text)
  }

  onButtonPress() {
    const { firstname, lastname, email, password } = this.props
    this.props.signupUser({ firstname, lastname, email, password })
  }

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

  render() {

    return (
      <Card>
        <CardSection>
          <Input
            placeholder='First Name'
            onChangeText={this.onFirstNameChange.bind(this)}
            value={this.props.firstname}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder='Last Name'
            onChangeText={this.onLastNameChange.bind(this)}
            value={this.props.lastname}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder='Email'
            onChangeText={this.onEmailChange.bind(this)}
            value={this.props.email}
          />
        </CardSection>
        <CardSection>
          <Input
            secureTextEntry
            placeholder='Password'
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
          />
        </CardSection>
        <ErrorMessage error={this.props.authError} />
        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    )
  }
}

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

export default connect(mapStateToProps, {
  authFirstNameChanged,
  authLastNameChanged,
  authEmailChanged,
  authPasswordChanged,
  signupUser
})(SignupForm)