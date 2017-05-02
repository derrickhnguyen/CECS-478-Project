import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

/* * * * * * * * * * * * * * * * * * * * * * * */
/*  This is a style container used to created  */
/*  many components for this application. Not  */
/*  much can be said about these components    */
/*  other than that.                           */
/* * * * * * * * * * * * * * * * * * * * * * * */

const Spinner = ({ size }) => {
  return (
    <View style={styles.spinnerStyles}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export { Spinner }