import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, Input, Spinner, Button, ErrorMessage } from './common'
import { findKeys, privateKeyFileNameChanged, publicKeyFileNameChanged } from '../actions'

class KeyForm extends Component {
  onPrivateKeyFileNameChange(text) {
    this.props.privateKeyFileNameChanged(text)
  }

  onPublicKeyFielNameChange(text) {
    this.props.publicKeyFileNameChanged(text)
  }

  onButtonPress() {
    const { privateKeyFileName, publicKeyFileName } = this.props
    this.props.findKeys({ privateKeyFileName, publicKeyFileName })
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
          <Text style={textStyle}>Enter your file names (no extension) that are in '/storage/emulated/0/Android/data/com.frontend/files'</Text>
        </CardSection>
        <CardSection>
          <Input
            placeholder='Private Key File Name'
            value={this.props.privateKey}
            onChangeText={this.onPrivateKeyFileNameChange.bind(this)}
          />
        </CardSection>
        <CardSection>
          <Input
            placeholder='Public Key File Name'
            value={this.props.publicKey}
            onChangeText={this.onPublicKeyFielNameChange.bind(this)}
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
  const { privateKeyFileName, publicKeyFileName, loading, keyErrorMsg } = focusChat
  return { privateKeyFileName, publicKeyFileName, loading, keyErrorMsg }
}

export default connect(mapStateToProps, {
  privateKeyFileNameChanged,
  publicKeyFileNameChanged,
  findKeys
})(KeyForm)