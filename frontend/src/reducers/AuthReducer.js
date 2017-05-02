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
} from '../actions/types'

// The initial states for all the variables
// in this reducer.
const INITIAL_STATE = {
  firstname: GLOBAL.EMPTY_STATE,
  lastname: GLOBAL.EMPTY_STATE,
  email: GLOBAL.EMPTY_STATE,
  password: GLOBAL.EMPTY_STATE,
  userId: GLOBAL.EMPTY_STATE,
  token: GLOBAL.EMPTY_STATE,
  privateKey: GLOBAL.EMPTY_STATE,
  authError: GLOBAL.EMPTY_STATE,
  hideBackImage: false,
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    // Alter only firstname, everything else
    // remains unchanged.
    case AUTH_FIRST_NAME_CHANGED:
      return {
        ...state,
        firstname: payload
      }
    // Alter only lastname, everything else
    // remains unchanged.
    case AUTH_LAST_NAME_CHANGED:
      return {
        ...state,
        lastname: payload
      }
    // Alter only email, everything else 
    // remains unchanged.
    case AUTH_EMAIL_CHANGED:
      return { 
        ...state,
        email: payload
      }
    // Alter only password, everything else
    // remains unchanged.
    case AUTH_PASSWORD_CHANGED:
      return {
        ...state,
        password: payload
      }
    // Loading is set to true and authError
    // is cleared out.
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        authError: GLOBAL.EMPTY_STATE
      }
    // Change firstname, lastname, token, userId,
    // and privateKey to new state.
    //
    // Everything else will revert back to its
    // initial state.
    case LOGIN_USER_SUCCESS:
      return {
        ...INITIAL_STATE,
        firstname: payload.firstname,
        lastname: payload.lastname,
        token: payload.token,
        userId: payload.userId,
        privateKey: payload.privateKey
      }
    // authError will change to new state.
    //
    // email, password, and loading will revert back
    // to its initial state.
    //
    // Everything else remains unchanged.
    case LOGIN_USER_FAIL:
      return {
        ...state,
        authError: payload,
        email: GLOBAL.EMPTY_STATE,
        password: GLOBAL.EMPTY_STATE,
        loading: false
      }
    // loading and hideBackImage will be set to true.
    // authError will change to new state.
    case SIGNUP_USER:
      return {
        ...state,
        loading: true,
        authError: payload,
        hideBackImage: true
      }
    // firstname, lastname, token, userId, and privateKey
    // will be set to its new states.
    //
    // authError will be cleared out.
    //
    // hideBackImage will revert back to false.
    case SIGNUP_USER_SUCCESS:
      return {
        ...INITIAL_STATE,
        firstname: payload.firstname,
        lastname: payload.lastname,
        token: payload.token,
        userId: payload.userId,
        privateKey: payload.privateKey,
        hideBackImage: false,
        authError: GLOBAL.EMPTY_STATE
      }
    // authError will be set to its new state.
    //
    // email and password will be cleared out.
    //
    // loading will revert back to false.
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        authError: payload,
        email: GLOBAL.EMPTY_STATE,
        password: GLOBAL.EMPTY_STATE,
        loading: false
      }
    case SIGNUP_CLICKED:
      return {
        ...INITIAL_STATE
      }
    case SIGNUP_LEFT_CLICKED:
      return {
        ...INITIAL_STATE
      }
    default:
      return state
  }
}