import React, { Component } from 'react'
import { Text } from 'react-native'
import { CardSection } from './common'
import { decryptor } from '../crypto'
import * as GLOBAL from '../../global'

class MessageItem extends Component {
  render() {
    return (
      <CardSection>
        <Text>{this.props.message}</Text>
      </CardSection>
    )
  }
}

export default MessageItem