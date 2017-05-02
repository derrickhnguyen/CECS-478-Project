import React from 'react'
import { Text, StyleSheet } from 'react-native'

/* * * * * * * * * * * * * * * * * * * * * * * */
/*  This is a style container used to created  */
/*  many components for this application. Not  */
/*  much can be said about these components    */
/*  other than that.                           */
/* * * * * * * * * * * * * * * * * * * * * * * */

const ErrorMessage = (props) => {
  return (
    <Text style={[styles.errorTextStyle, props.style]}>
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