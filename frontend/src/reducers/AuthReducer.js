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
    case AUTH_FIRST_NAME_CHANGED:
      return {
        ...state,
        firstname: payload
      }
    case AUTH_LAST_NAME_CHANGED:
      return {
        ...state,
        lastname: payload
      }
    case AUTH_EMAIL_CHANGED:
      return { 
        ...state,
        email: payload
      }
    case AUTH_PASSWORD_CHANGED:
      return {
        ...state,
        password: payload
      }
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        authError: GLOBAL.EMPTY_STATE
      }
    case SIGNUP_USER:
      return {
        ...state,
        loading: true,
        authError: GLOBAL.EMPTY_STATE,
        hideBackImage: true
      }
    case LOGIN_USER_SUCCESS:
      return {
        ...INITIAL_STATE,
        firstname: payload.firstname,
        lastname: payload.lastname,
        token: payload.token,
        userId: payload.userId,
        privateKey: payload.privateKey
      }
    case LOGIN_USER_FAIL:
      return {
        ...state,
        authError: payload,
        email: GLOBAL.EMPTY_STATE,
        password: GLOBAL.EMPTY_STATE,
        loading: false
      }
    case SIGNUP_USER_SUCCESS:
      return {
        ...INITIAL_STATE,
        firstname: payload.firstname,
        lastname: payload.lastname,
        token: payload.token,
        userId: payload.userId,
        privateKey: payload.privateKey,
        hideBackImage: false
      }
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