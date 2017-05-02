import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { CardSection } from './common'
import * as GLOBAL from '../../global'

/*
* Component that displays Message Item.
*/
class MessageItem extends Component {
  // Main function to render Message Item.
  render() {
    // If message has a key called, date, then it is
    // from the client, therefore will be aligned to
    // the right.
    if (this.props.message.date) {
      return (
        <CardSection style={styles.rightAlignStyle}>
          <Text style={styles.fontStyle}>{this.props.message.message}</Text>
        </CardSection>
      )
    } else {
      // Message is from the user, align to the left.
      return (
        <CardSection style={styles.leftAlignStyle}>
          <Text style={styles.fontStyle}>{this.props.message}</Text>
        </CardSection>
      )
    }
  }
}

// Styles property.
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

// Export MessageItem.js to be used for application.
export default MessageItem