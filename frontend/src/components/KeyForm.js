import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Spinner, Button, ErrorMessage } from './common'
import { findPublicKey, publicKeyFileNameChanged } from '../actions'

class KeyForm extends Component {
  onPublicKeyFileNameChange(text) {
    this.props.publicKeyFileNameChanged(text)
  }

  onButtonPress() {
    const { publicKeyFileName, otherUserId } = this.props
    this.props.findPublicKey({ publicKeyFileName, otherUserId })
  }

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

  render() {
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

const styles = {
  textStyle: {
    fontSize: 18,
    textAlign: 'center'
  }
}

const mapStateToProps = ({ focusChat }) => {
  const {
    publicKeyFileName,
    loading,
    keyErrorMsg,
    otherUserId 
  } = focusChat

  return {
    publicKeyFileName,
    loading,
    keyErrorMsg,
    otherUserId
  }
}

export default connect(mapStateToProps, {
  publicKeyFileNameChanged,
  findPublicKey
})(KeyForm)