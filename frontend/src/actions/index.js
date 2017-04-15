import axios from 'axios'
import { Actions } from 'react-native-router-flux'
import { 
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER
} from './types'

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  }
}

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  }
}

export const loginUser = ({ email, password }) => {
  const { emptyInput, loginFailed } = errorMsgs

  return (dispatch) => {
    dispatch({
      type: LOGIN_USER
    })

    if(email === '' || password === '') {
      loginUserFail(dispatch, emptyInput)
    } else {
      axios.post('http://10.0.2.2:5000/signin', { email, password })
        .then(res => loginUserSuccess(dispatch, res.data.token))
        .catch(() => loginUserFail(dispatch, loginFailed))
    }
  }
}

const loginUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMsg
  })
}

const loginUserSuccess = (dispatch, token) => {
  console.log('success')
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: token
  })

  Actions.main()
}

const errorMsgs = {
  emptyInput: 'Please provide email/password',
  loginFailed: 'Login failed'
}