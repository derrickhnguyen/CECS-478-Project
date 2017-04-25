import axios from 'axios'
import { Actions } from 'react-native-router-flux'
import RSAKey from 'react-native-rsa'
import RNFS from 'react-native-fs'
import bcrypt from 'bcryptjs'
import crypto from ('crypto-js')
import { secret } from '../../config'
import {
  AUTH_FIRST_NAME_CHANGED,
  AUTH_LAST_NAME_CHANGED,
  AUTH_EMAIL_CHANGED,
  AUTH_PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  SIGNUP_USER,
  SIGNUP_CLICKED,
  SIGNUP_LEFT_CLICKED
} from './types'

/*
* Triggers whenever firstname input changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const authFirstNameChanged = (text) => {
  return {
    type: AUTH_FIRST_NAME_CHANGED,
    payload: text
  }
}

/*
* Triggers whenever lastname input changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const authLastNameChanged = (text) => {
  return {
    type: AUTH_LAST_NAME_CHANGED,
    payload: text
  }
}

/*
* Triggers whenever email input changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const authEmailChanged = (text) => {
  return {
    type: AUTH_EMAIL_CHANGED,
    payload: text
  }
}

/*
* Triggers whenever password input changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const authPasswordChanged = (text) => {
  return {
    type: AUTH_PASSWORD_CHANGED,
    payload: text
  }
}

/*
* Checks to see if user can be authenticated with the provided
* parameters by implementing 'REMOTE LOGIN'.
* 
* @param   {object}   = { email:String, password:String }
*/
export const loginUser = ({ email, password }) => {
  // Extract error messages from object.
  const { emailPasswordEmpty, loginFailed } = errorMsgs

  // Send an action type of LOGIN_USER to indicate
  // that request is being processed.
  return (dispatch) => {
    dispatch({
      type: LOGIN_USER
    })

    // Make sure email and password exists.
    if (email === '' || password === '') {
      loginUserFail(dispatch, emailPasswordEmpty)
    } else {
      // Make HTTP POST request to receive salt and challenge
      axios.post('https://miningforgoldstein.me/requestSaltAndChallenge', { email })
        .then((res) =>{
          // Extract salt and challenge from the response.
          const { salt, challenge } = res.data

          // Hash the password with the given salt.
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              // Respond with a client error.
              loginUserFail(dispatch, loginFailed)
            } else {
              // With the given hash password, create a tag with the hashed password
              // and challenge.
              const key = hash
              const tag = crypto.HmacSHA256(challenge, key).toString()
              
              //Make HTTP Post to request for token.
              axios.post('https://miningforgoldstein.me/validateTag', { email, challenge, tag })
                .then((res) => {
                  // Token request was successful.
                  loginUserSuccess(dispatch, res.data)
                })
                .catch(() => {
                  // Token request was unsuccessful.
                  loginUserFail(dispatch, loginFailed)
                })
            }
          })
        })
        .catch(() => {
          // Salt and challenge request was unsuccessful.
          loginUserFail(dispatch, loginFailed)
        })
    }
  }
}

export const signupUser = ({ firstname, lastname, email, password }) => {
  const { emptyInput, signupFailed, invalidEmail, keyGenerationFail } = errorMsgs

  return (dispatch) => {
    dispatch({
      type: SIGNUP_USER
    })

    if (firstname === '' || lastname === '' || email === '' || password === '') {
      signupUserFail(dispatch, emptyInput)
    } else if (!email.includes('@')) {
      loginUserFail(dispatch, invalidEmail)
    } else {
      axios.post('https://miningforgoldstein.me/signup', { firstname, lastname, email, password })
        .then((res) => {
          const rsa = new RSAKey()
          rsa.generate(2048, '10001')
          const publicKey = rsa.getPublicString()
          const privateKey = rsa.getPrivateString()

          const pubPath = `${RNFS.ExternalDirectoryPath}/${firstname}${lastname}-publickey.txt`
          RNFS.writeFile(pubPath, publicKey, 'utf8')
            .then((success) => {
              const privPath = `${RNFS.ExternalDirectoryPath}/${firstname}${lastname}-private-key.txt`
              RNFS.writeFile(privPath, privateKey, 'utf8')
                .then((success) => {
                  signupUserSuccess(dispatch, res.data)
                })
                .catch((err) => {
                  signupUserFail(dispatch, keyGenerationFail)
                })
            })
            .catch((err) => {
              signupUserFail(dispatch, keyGenerationFail)
            })
        })
        .catch((err) => {
          signupUserFail(dispatch, signupFailed)
      })
    }
  }
}

export const signupClicked = () => {
  return (dispatch) => {
    dispatch({
      type: SIGNUP_CLICKED
    })

    Actions.signup()
  }
}

export const signupLeftClicked = () => {
  return (dispatch) => {
    dispatch({
      type: SIGNUP_LEFT_CLICKED
    })
  }
}

const loginUserSuccess = (dispatch, data) => {
  const { firstname, lastname, token, id } = data
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: {
      firstname: firstname,
      lastname: lastname,
      token: token,
      userId: id
    }
  })

  Actions.main({title: `Welcome, ${firstname}`})
}

const loginUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMsg
  })
}

const signupUserSuccess = (dispatch, data) => {
  const { firstname, lastname, token, id } = data
  dispatch({
    type: SIGNUP_USER_SUCCESS,
    payload: {
      firstname: firstname,
      lastname: lastname,
      token: token,
      userId: id
    }
  })

  Actions.main({title: `Welcome, ${firstname}`})
}

const signupUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: SIGNUP_USER_FAIL,
    payload: errorMsg
  })
}

const errorMsgs = {
  emailPasswordEmpty: 'Please provide email/password',
  loginFailed: 'Login failed',
  emptyInput: 'Please fill out every input',
  signupFailed: 'Signup failed',
  invalidEmail: 'Please enter a valid email',
  keyGenerationFail: 'Key pair generation failed'
}