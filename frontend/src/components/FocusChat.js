import React, { Component } from 'react'
import { Text, View, ListView, StyleSheet, TextInput } from 'react-native'
import TimerMixin from 'react-timer-mixin'
import { connect } from 'react-redux'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { Input, Card, CardSection, Button, ErrorMessage } from './common'
import { chatInputChanged, sendMessage, checkAndUpdateMessages, setFocusChatIntervalId } from '../actions'
import MessageItem from './MessageItem'
import * as GLOBAL from '../../global'

/*
* Component that displays the Focus Chat Page.
*/
class FocusChat extends Component {
  // Declare variables for every function in this class
  // to use.
  constructor(props) {
    super(props)
    this.mixins = [TimerMixin]
  }

  // Before component renders:
  // set the data source for the list view.
  componentWillMount() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.dataSource = ds.cloneWithRows(this.props.messages)
  }

  // After component renders:
  // create an interval function that will constantly check
  // any new messages.
  componentDidMount() {
    const { token, otherUserId, userId, privateKey } = this.props
    let focusChatIntervalId = setInterval(() => {
      this.props.checkAndUpdateMessages({ token, otherUserId, userId, privateKey })
    }, 5000) 

    this.props.setFocusChatIntervalId({ focusChatIntervalId })
  }

  // Helper function for List View to display
  // Message Item.
  renderRow(message) {
    return (
      <MessageItem message={message} />
    )
  }

  // Helper function that displays error message, notification message,
  // or the list view depending on conditions.
  renderListView() {
    // Extract states from props object.
    const { privateKey, publicKey, messages, otherUserFirstname, dataSource } = this.props
    
    // Make sure that public key and private key are provided
    if (publicKey === GLOBAL.EMPTY_STATE || privateKey === GLOBAL.EMPTY_STATE) {
      return (
        <ErrorMessage style={{height: 450}} error={`Please provide ${otherUserFirstname}'s public key`} />
      )
    } else if (messages.length === 0) {
      // Return notification message if there are no messages.
      return (
        <ErrorMessage style={{height: 450}} error={`There are currently no messages. To start, type anything down below and press 'Send'!`} />
      )
    } else {
      // Displays List View.
      return (
        <CardSection style={{height: 450}}>
          <ListView
            dataSource={dataSource || this.dataSource}
            renderRow={this.renderRow}
            enableEmptySections
          />  
        </CardSection>
      )
    }
  }

  // Whenever input changes, this function
  // will be called to change the message
  // input state.
  onInputChange(text) {
    this.props.chatInputChanged(text)
  }

  // Whenever the button is pressed, this function
  // will be called to invoke the sendMessage function.
  // ../actions/ChatActions/sendMessage
  onButtonPress() {
    const {
      input,
      otherUserId,
      userId,
      token,
      publicKey,
      privateKey,
      messages
    } = this.props

    this.props.sendMessage({
      input,
      otherUserId,
      userId,
      token,
      publicKey,
      privateKey,
      messages
    })
  }

  // Main function to render Focus Chat page.
  render() {
    // Extract object within the styles object.
    const { inputContainerStyle, inputStyle, inputInnerStyle, buttonStyle } = styles

    // Extract states from props object.
    const { input, chatErrorMsg } = this.props

    return (
      <Card>
        {this.renderListView()}
        <ErrorMessage error={chatErrorMsg} />
        <CardSection style={inputContainerStyle}>
          <Input
            onChangeText={this.onInputChange.bind(this)}
            value={input}
            style={inputStyle}
            innerStyle={inputInnerStyle}
          />
          <Button
            style={buttonStyle}
            onPress={this.onButtonPress.bind(this)}
          >
            Send
          </Button>
        </CardSection>
      </Card>
    )
  }
}

// Styles property.
const styles = StyleSheet.create({
  inputContainerStyle: {
    flexDirection: 'row'
  },
  inputStyle: {
    flex: 4,
  },
  inputInnerStyle: {
    width: 200
  },
  buttonStyle: {
    flex: 1
  }
})

// Extract states from auth and focusChat reducer,
// and use it for this page.
const mapStateToProps = ({ focusChat, auth }) => {
  const {
    messages,
    input,
    otherUserId,
    otherUserFirstname,
    publicKey,
    chatErrorMsg,
    dataSource
  } = focusChat

  const {
    userId,
    token,
    privateKey
  } = auth

  return {
    messages,
    input,
    userId,
    otherUserId,
    otherUserFirstname,
    token,
    privateKey,
    publicKey,
    chatErrorMsg,
    dataSource
  }
}

// Connects this page with redux so states can be
// used from auth and focusChat.
//
// Exports ChatList.js to be used for application.
export default connect(mapStateToProps, {
  chatInputChanged,
  sendMessage,
  checkAndUpdateMessages,
  setFocusChatIntervalId
})(FocusChat)