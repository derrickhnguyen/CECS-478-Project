import React from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native'

/* * * * * * * * * * * * * * * * * * * * * * * */
/*  This is a style container used to created  */
/*  many components for this application. Not  */
/*  much can be said about these components    */
/*  other than that.                           */
/* * * * * * * * * * * * * * * * * * * * * * * */

const Input = ({ placeholder, value, onChangeText, secureTextEntry, style, innerStyle }) => {
  const { inputStyle, containerStyle } = styles

  return (
    <View style={[containerStyle, style]}>
      <TextInput
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[inputStyle, innerStyle]} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    height: 40,
    width: 300
  },
  containerStyle: {
    height: 45,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export { Input }