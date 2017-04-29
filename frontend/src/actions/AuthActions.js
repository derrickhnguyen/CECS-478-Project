import axios from 'axios'
import { Actions, ActionConst } from 'react-native-router-flux'
import RSAKey from 'react-native-rsa'
import RNFS from 'react-native-fs'
import bcrypt from 'bcryptjs'
import cryptojs from 'crypto-js'
import * as GLOBAL from '../../global'
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

  return (dispatch) => {
    // Send an action type of LOGIN_USER to indicate
    // that request is being processed.
    dispatch({ type: LOGIN_USER })

    // Make sure email and password exists.
    if (email === GLOBAL.EMPTY_STATE || password === GLOBAL.EMPTY_STATE) {
      loginUserFail(dispatch, emailPasswordEmpty)
    } else {
      // Make HTTP POST request to receive salt and challenge
      axios.post('https://miningforgoldstein.me/requestSaltAndChallenge', { email })
        .then((res) =>{
          // If POST request is successful, extract salt and 
          // challenge from the response.
          const { salt, challenge } = res.data

          // Hash the password with the given salt.
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              // If there is an error, respond with a client error.
              loginUserFail(dispatch, loginFailed)
            } else {
              // With the given hash password, create a tag with the hashed password
              // and challenge.
              const key = hash
              const tag = cryptojs.HmacSHA256(challenge, key).toString()
              
              //Make HTTP Post to request for token.
              axios.post('https://miningforgoldstein.me/validateTag', { email, challenge, tag })
                .then((res) => {
                  const { firstname, lastname } = res.data

                  RNFS.readFile(`${RNFS.ExternalDirectoryPath}/${firstname}${lastname}-private-key.txt`)
                    .then((privateKey) => {
                      // Save private key into local storage.
                      GLOBAL.storage.save({
                        key: GLOBAL.PRIVATE_KEY_STRING,
                        rawData: { privateKey },
                        expires: null
                      })

                      res.data[GLOBAL.PRIVATE_KEY_STRING] = privateKey

                      // Send the appropriate response message 
                      // with the response data.
                      loginUserSuccess(dispatch, res.data)
                    })
                    .catch(() => {
                      // If private key was unable to be fetched,
                      // send the appropriate response message.
                      loginUserFail(dispatch, loginFailed)
                    })
                })
                .catch(() => {
                  // Login user request was unsuccessful.
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

/*
* Signs up a user if email is not taken. Once sign up is successful, a 
* public and private key will be generated and will be stored in the
* user's phone in, '/storage/emulated/0/Android/data/com.frontend/files'.
* 
* @param   {object}   = { firstname:String, lastname:String, email:String, password:String }
*/
export const signupUser = ({ firstname, lastname, email, password }) => {
  // Extract error messages from the object, errorMsgs.
  const { emptyInput, signupFailed, invalidEmail, keyGenerationFail } = errorMsgs

  return (dispatch) => {
    // Indicated to the user that there is an attempt
    // to sign them up.
    dispatch({ type: SIGNUP_USER })

    // Make sure there are no empty inputs.
    if (firstname === GLOBAL.EMPTY_STATE || lastname === GLOBAL.EMPTY_STATE || email === GLOBAL.EMPTY_STATE || password === GLOBAL.EMPTY_STATE) {
      // Send the appropriate response if there are empty inputs.
      signupUserFail(dispatch, emptyInput)
    } else if (!email.includes('@')) {
      // Send the appropriate response if the user does not has a '@' sign
      // in the email input.
      signupUserFail(dispatch, invalidEmail)
    } else {
      // Send a POST request with the given input that the user has given.
      axios.post('https://miningforgoldstein.me/signup', { firstname, lastname, email, password })
        .then((res) => {
          // If the POST request is successful, generate a new RSA key pair.
          const rsa = new RSAKey()
          rsa.generate(2048, '10001')
          const publicKey = rsa.getPublicString()
          const privateKey = rsa.getPrivateString()

          // Declare the path of where to store the public key.
          const pubPath = `${RNFS.ExternalDirectoryPath}/${firstname}${lastname}-publickey.txt`

          // Write the public key to declared file path.
          RNFS.writeFile(pubPath, publicKey, 'utf8')
            .then((success) => {
              // If public key was saved successfully, Declare the path of 
              // where to store the private key.
              const privPath = `${RNFS.ExternalDirectoryPath}/${firstname}${lastname}-private-key.txt`

              // Write the private key to declared file path
              RNFS.writeFile(privPath, privateKey, 'utf8')
                .then((success) => {
                  // Save private key into local storage.
                  GLOBAL.storage.save({
                    key: GLOBAL.PRIVATE_KEY_STRING,
                    rawData: { privateKey },
                    expires: null
                  })

                  res.data[GLOBAL.PRIVATE_KEY_STRING] = privateKey

                  // If private key was saved successfully, send the appropriate
                  // reponse to client.
                  signupUserSuccess(dispatch, res.data)
                })
                .catch((err) => {
                  // If private key was saved unsuccessfully, send the appropriate
                  // reponse to client.
                  signupUserFail(dispatch, keyGenerationFail)
                })
            })
            .catch((err) => {
              // If public key was saved unsuccessfully, send the appropriate
              // reponse to client.
              signupUserFail(dispatch, keyGenerationFail)
            })
        })
        .catch((err) => {
          // If sign up POST requenst is unsuccessfull, send the appropriate
          // response to client.
          signupUserFail(dispatch, signupFailed)
      })
    }
  }
}

// If sign up button was clicked, dispatch
// a SIGNUP_CLICKED type to reset appropriate
// data, then change to Signup screen.
export const signupClicked = () => {
  return (dispatch) => {
    dispatch({ type: SIGNUP_CLICKED })
    Actions.signup()
  }
}

// If back button on Signup screen is clicked,
// dispach a SIGNUP_LEFT_CLICKED type to reset
// appropriate data, the pops back to Sigin screen.
export const signupLeftClicked = () => {
  return (dispatch) => {
    dispatch({ type: SIGNUP_LEFT_CLICKED })
  }
}

/*
* Helper function to dispatch LOGIN_USER_SUCCESS
* type. It will return the appropriate data to
* popular the user's main screen.
* 
* @param    {function}    dispatch
* @param    {object}      data
*/
const loginUserSuccess = (dispatch, data) => {
  const { firstname, lastname, token, id, privateKey } = data
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: {
      userId: id,
      firstname,
      lastname,
      privateKey,
      token
    }
  })

  // Changes to user's main screen.
  // ActionConst.RESET unables the users to press the back
  // button to go back to the Login screen.
  Actions.main({title: `Welcome, ${firstname}`, type: ActionConst.RESET})
}

/*
* Helper function to dispatch LOGIN_USER_FAIL
* type. It will return an errorMsg.
* 
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
const loginUserFail = (dispatch, errorMsg) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: errorMsg
  })
}

/*
* Helper function to dispatch SIGNUP_USER_SUCCESS
* type. It will return the appropriate data to
* populate the user's main screen.
* 
* @param    {function}    dispatch
* @param    {object}      data
*/
const signupUserSuccess = (dispatch, data) => {
  const { firstname, lastname, token, id, privateKey } = data
  dispatch({
    type: SIGNUP_USER_SUCCESS,
    payload: {
      userId: id,
      firstname,
      lastname,
      privateKey,
      token
    }
  })

  // Changes to user's main screen.
  // ActionConst.RESET unables the users to press the back
  // button to go back to the Login screen.
  Actions.main({title: `Welcome, ${firstname}`, type: ActionConst.RESET})
}

/*
* Helper function to dispatch SIGNUP_USER_FAIL
* type. It will return an errorMsg.
* 
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
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