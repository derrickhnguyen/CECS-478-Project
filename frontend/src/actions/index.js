import axios from 'axios'
import { 
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  GET_TOKEN
} from './types'

export const getToken = (token) => {
  return {
    type: GET_TOKEN,
    payload: token
  }
}

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
  return (dispatch) => {
    axios.post('http://10.0.2.2:5000/signin', { email, password })
      .then(res => {
        dispatch({ type: 'LOGIN_USER_SUCCESS', payload: res.data.token })
      })
  }
}