import React, { Component } from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { BorderCard, BorderCardSection, CardSection } from './common'

/*
* Component that displays a single message item.
*/
class ChatItem extends Component {
  // Main function to render Chat Item.
  render() {
    // Extract object within the styles object.
    const { containerStyle, imageStyle, textStyle } = styles

    return(
      <BorderCard style={{backgroundColor: '#778899'}}>
        <BorderCardSection style={{backgroundColor: '#778899'}}>
          <View style={containerStyle}>
            <Image style={imageStyle} source={require('../../images/person-placeholder.jpg')} />
            <Text style={textStyle}>{`${this.props.firstname} ${this.props.lastname}`}</Text>
          </View>
        </BorderCardSection>
      </BorderCard>
    )
  }
}

// Styles property.
const styles = StyleSheet.create({
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
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: 'bold'
  }
})

// Export ChatItem.js to be used for application.
export default ChatItem