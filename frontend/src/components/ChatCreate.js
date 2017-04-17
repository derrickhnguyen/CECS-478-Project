import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Button, ErrorMessage, Spinner } from './common'
import { chatEmailChanged, createChat } from '../actions'

class ChatCreate extends Component {
  onEmailChange(text) {
    this.props.chatEmailChanged(text)
  }

  onButtonPress() {
    const { email, token } = this.props
    this.props.createChat({ email, token })
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
    const { textStyle } = styles

    return (
      <Card>
        <CardSection >
          <Text style={textStyle}>Who would you like to start a chat with?</Text>
        </CardSection>
        <CardSection>
          <Input
            placeholder='Email'
            value={this.props.email}
            onChangeText={this.onEmailChange.bind(this)}
          />
        </CardSection>
        <ErrorMessage error={this.props.error} />
        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    )
  }
}

const styles = {
  textStyle: {
    fontSize: 18,
    textAlign: 'center'
  }
}

const mapStateToProps = ({ auth, chatForm }) => {
  const { token } = auth
  const { email, error, loading } = chatForm
  return {
    email,
    token,
    error,
    loading
  }
}

export default connect(mapStateToProps, {
  chatEmailChanged,
  createChat
})(ChatCreate)