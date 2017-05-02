import React from 'react'
import { View, StyleSheet } from 'react-native'

/* * * * * * * * * * * * * * * * * * * * * * * */
/*  This is a style container used to created  */
/*  many components for this application. Not  */
/*  much can be said about these components    */
/*  other than that.                           */
/* * * * * * * * * * * * * * * * * * * * * * * */

const CardSection = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
})

export { CardSection }