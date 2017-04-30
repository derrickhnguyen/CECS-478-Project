import React, { Component } from 'react'
import { Text, View, ListView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Input, Card, CardSection, Button, ErrorMessage } from './common'
import { chatInputChanged, sendMessage } from '../actions'
import MessageItem from './MessageItem'
import * as GLOBAL from '../../global'

class FocusChat extends Component {
  componentWillMount() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.dataSource = ds.cloneWithRows(this.props.messages)
  }

  renderRow(message) {
    return (
      <MessageItem message={message} />
    )
  }

  renderListView() {
    const { privateKey, publicKey, messages, otherUserFirstname, dataSource } = this.props
    
    if (publicKey === GLOBAL.EMPTY_STATE || privateKey === GLOBAL.EMPTY_STATE) {
      return (
        <ErrorMessage error={`Please, provide your private key and/or ${otherUserFirstname}'s public key`} />
      )
    } else if (messages.length === 0) {
      return (
        <ErrorMessage error={`There are currently no messages. To start, type anything down below and press 'Send'!`} />
      )
    } else {
      return (
        <ListView
          dataSource={dataSource || this.dataSource}
          renderRow={this.renderRow}
          enableEmptySections
        />  
      )
    }
  }

  onInputChange(text) {
    this.props.chatInputChanged(text)
  }

  onButtonPress() {
    const {
      input,
      otherUserId,
      userId,
      token,
      publicKey,
      privateKey
    } = this.props

    this.props.sendMessage({
      input,
      otherUserId,
      userId,
      token,
      publicKey,
      privateKey
    })
  }

  render() {
    const { inputContainerStyle, inputStyle, inputInnerStyle, buttonStyle } = styles
    const { input, chatErrorMsg } = this.props
    return (
      <Card>
        <CardSection style={{height: 450}}>
          {this.renderListView()}
        </CardSection>
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

const styles = StyleSheet.create({
  inputContainerStyle: {
    flexDirection: 'row'
  },
  inputStyle: {
    flex: 3
  },
  inputInnerStyle: {
    width: 200
  },
  buttonStyle: {
    flex: 1,
  }
})

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

export default connect(mapStateToProps, {
  chatInputChanged,
  sendMessage
})(FocusChat)