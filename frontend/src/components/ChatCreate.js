import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Button, ErrorMessage, Spinner } from './common'
import { chatEmailChanged, createChat } from '../actions'

/*
* Component that displays the Chat Creation Page.
*/
class ChatCreate extends Component {
  // Whenever input value changes, this function will 
  // be called to change the value of the input state.
  //
  // ../actions/ChatActions/chatEmailChanged
  onEmailChange(text) {
    this.props.chatEmailChanged(text)
  }

  // Whenever the button is clicked, this function will
  // be called to handle the request to make sure if 
  // chat can be created or not.
  //
  // ../actions/ChatActions/createChat
  onButtonPress() {
    const { email, token, userId } = this.props
    this.props.createChat({ email, token, userId })
  }

  // If the state, loading, is set to true; display
  // a spinner to indicate request is being processed.
  //
  // If the state, loading, is set to false; display
  // the button.
  renderButton() {
    if (this.props.loading) {
      return <Spinner size='large' />
    } else {
      return (
        <Button onPress={this.onButtonPress.bind(this)}>
          Create Chat
        </Button>
      )
    }
  }

  // Main function to render Chat Creation page.
  render() {
    // Extract object within the styles object.
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
        <ErrorMessage error={this.props.chatFormError} />
        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    )
  }
}

// Styles property.
const styles = {
  textStyle: {
    fontSize: 18,
    textAlign: 'center'
  }
}

// Extract states from auth and chatForm reducer,
// and use it for this page.
const mapStateToProps = ({ auth, chatForm }) => {
  const { token, userId } = auth
  const { email, chatFormError, loading } = chatForm
  return {
    email,
    token,
    userId,
    chatFormError,
    loading
  }
}

// Connects this page with redux so states can be
// used from auth and chatForm.
//
// Exports ChatCreate.js to be used for application.
export default connect(mapStateToProps, {
  chatEmailChanged,
  createChat
})(ChatCreate)