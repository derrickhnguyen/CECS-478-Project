import React from 'react'
import { View, StyleSheet } from 'react-native'

const BorderCard = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    elevation : 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  }
})

export { BorderCard }