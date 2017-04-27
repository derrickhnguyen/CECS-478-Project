import React, { Component } from 'react'
import { Text } from 'react-native'
import { CardSection } from './common'

class MessageItem extends Component {
  render() {

    return (
      <CardSection>
        <Text>{this.props.message.timestamp}</Text>
      </CardSection>
    )
  }
}

export default MessageItem