import React from 'react'
import { View, StyleSheet } from 'react-native'

const Card = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    elevation : 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  }
})

export { Card }