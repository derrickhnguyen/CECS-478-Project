import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { Button, Card, CardSection, Input, Spinner } from './common'
import axios from 'axios'

class LoginForm extends Component {
  state = { 
    email: '',
    password: '',
    token: '',
    error: '',
    loading: false
  }

  onButtonPress() {
    this.setState({ 
      error: '',
      loading: true
    })

    const { email, password } = this.state

    if (email == '' || password == '') {
      this.setState({
        error: 'Please provide both your email and password',
        loading: false
      })
    } else {
      axios.post('http://10.0.2.2:5000/signin', { email, password })
        .then(res => this.onLoginSuccess(res.data.token))
        .catch(error => this.onLoginFailure())
    }
  }

  onLoginSuccess(token) {
    this.setState({
      token: token,
      email: '',
      password: '',
      loading: false,
      error:''
    })
  }

  onLoginFailure() {
    this.setState({
      email: '',
      password: '',
      loading: false,
      error: 'Error, please try again'
    })
  }

  renderButton() {
    if (this.state.loading === true) {
      return <Spinner size="small" />
    } else {
      return (
        <Button onPress={this.onButtonPress.bind(this)}>Log in</Button>
      )
    }
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            placeholder='Email'
          />
        </CardSection>
        <CardSection>
          <Input
            secureTextEntry
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            placeholder='Password'
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  errorTextStyle: {
    marginLeft: 20,
    marginRight: 20,
    fontSize: 13,
    alignSelf: 'center',
    color: 'red'
  }
})

export default LoginForm