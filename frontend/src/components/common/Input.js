import React from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native'

const Input = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  const { inputStyle, containerStyle } = style

  return (
    <View style={containerStyle}>
      <TextInput
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={inputStyle} 
      />
    </View>
  )
}

const style= StyleSheet.create({
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