// Import libraries for making a component
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

// Make a component
const Header = (props) => {
  const { textStyle, viewStyle } = styles

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#87cefa',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    elevation: 3,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20,
    color: '#fff'
  }
})

// Make the component available to other parts of the app
export { Header }