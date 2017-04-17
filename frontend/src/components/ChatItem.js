import React, { Component } from 'react'
import { Text, RouchableWithoutFeedback, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { BorderCard, BorderCardSection, CardSection } from './common'

class ChatItem extends Component {
  render() {
    return(
      <BorderCard>
        <BorderCardSection>
          <Text>test</Text>
        </BorderCardSection>
      </BorderCard>
    )
  }
}

export default ChatItem