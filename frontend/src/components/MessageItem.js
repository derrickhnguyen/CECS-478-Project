import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { CardSection } from './common'
import * as GLOBAL from '../../global'

class MessageItem extends Component {
  render() {
    if (this.props.message.date) {
      return (
        <CardSection style={styles.rightAlignStyle}>
          <Text style={styles.fontStyle}>{this.props.message.message}</Text>
        </CardSection>
      )
    } else {
      return (
        <CardSection style={styles.leftAlignStyle}>
          <Text style={styles.fontStyle}>{this.props.message}</Text>
        </CardSection>
      )
    }
  }
}

const styles = StyleSheet.create({
  leftAlignStyle: {
    width: 200,
    backgroundColor: 'grey',
    alignSelf: 'flex-start',
    marginTop: 5,
    borderRadius: 10
  },
  rightAlignStyle: {
    backgroundColor: '#778899',
    width: 200,
    alignSelf: 'flex-end',
    marginTop: 5,
    borderRadius: 10
  },
  fontStyle: {
    color: 'white'
  }
})

export default MessageItem