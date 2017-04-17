import React from 'react'
import { Text, StyleSheet } from 'react-native'

const ErrorMessage = (props) => {
  return (
    <Text style={styles.errorTextStyle}>
      {props.error}
    </Text>
  )
}

const styles = StyleSheet.create({
  errorTextStyle: {
    fontSize: 15,
    alignSelf: 'center',
    color: 'red'
  },
})

export { ErrorMessage }