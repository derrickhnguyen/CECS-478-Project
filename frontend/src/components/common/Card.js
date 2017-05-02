import React from 'react'
import { View, StyleSheet } from 'react-native'

/* * * * * * * * * * * * * * * * * * * * * * * */
/*  This is a style container used to created  */
/*  many components for this application. Not  */
/*  much can be said about these components    */
/*  other than that.                           */
/* * * * * * * * * * * * * * * * * * * * * * * */

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