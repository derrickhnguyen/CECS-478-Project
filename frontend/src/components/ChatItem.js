import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { BorderCard, BorderCardSection, CardSection } from './common'

class ChatItem extends Component {
  render() {
    const { containerStyle, imageStyle, textStyle } = styles

    return(
      <BorderCard>
        <BorderCardSection>
          <View style={containerStyle}>
            <Image style={imageStyle} source={require('../../images/person-placeholder.jpg')} />
            <Text style={textStyle}>{`${this.props.firstname} ${this.props.lastname}`}</Text>
          </View>
        </BorderCardSection>
      </BorderCard>
    )
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageStyle: {
    width: 50,
    height: 50
  },
  textStyle: {
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: 'bold'
  }
}

export default ChatItem