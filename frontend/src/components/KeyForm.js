import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Spinner, Button, ErrorMessage } from './common'
import { findPublicKey, publicKeyFileNameChanged } from '../actions'

/*
* Component that displays the Key Form Page.
*/
class KeyForm extends Component {
  // Whenever public key input changes, this function
  // will be called to change the public key input state.
  // ../actions/ChatActions/publicKeyFileNameChaged
  onPublicKeyFileNameChange(text) {
    this.props.publicKeyFileNameChanged(text)
  }

  // Whenever the button is pressed, this function
  // will be called to invoke the findPublicKey function.
  // ../actions/ChatActions/findPublicKey
  onButtonPress() {
    const { userId, publicKeyFileName, otherUserId } = this.props
    this.props.findPublicKey({ userId, publicKeyFileName, otherUserId })
  }

  // Helper function that displays either a spinner
  // or the button.
  renderButton() {
    if (this.props.loading) {
      return <Spinner size='large' />
    } else {
      return (
        <Button onPress={this.onButtonPress.bind(this)}>
          Upload Keys
        </Button>
      )
    }
  }

  // Main function to render Key Form page.
  render() {
    // Extract object within the styles object.
    const { textStyle } = styles

    return (
      <Card>
        <CardSection>
          <Text style={textStyle}>Enter the file name (no extension) that is in '/storage/emulated/0/Android/data/com.frontend/files'</Text>
        </CardSection>
        <CardSection>
          <Input
            placeholder='Public Key File Name'
            value={this.props.publicKey}
            onChangeText={this.onPublicKeyFileNameChange.bind(this)}
          />
        </CardSection>
        <ErrorMessage error={this.props.keyErrorMsg} />
        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    )    
  }
}

// Styles property.
const styles = {
  textStyle: {
    fontSize: 18,
    textAlign: 'center'
  }
}

// Extract states from auth and focusChat reducer,
// and use it for this page.
const mapStateToProps = ({ auth, focusChat }) => {
  const { userId } = auth

  const {
    publicKeyFileName,
    loading,
    keyErrorMsg,
    otherUserId 
  } = focusChat

  return {
    userId,
    publicKeyFileName,
    loading,
    keyErrorMsg,
    otherUserId
  }
}

// Connects this page with redux so states can be
// used from auth and focusChat.
//
// Exports KeyForm.js to be used for application.
export default connect(mapStateToProps, {
  publicKeyFileNameChanged,
  findPublicKey
})(KeyForm)