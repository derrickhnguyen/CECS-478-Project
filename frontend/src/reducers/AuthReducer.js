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
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  userId: '',
  token: '',
  error: '',
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_FIRST_NAME_CHANGED:
      return {
        ...state,
        firstname: action.payload
      }
    case AUTH_LAST_NAME_CHANGED:
      return {
        ...state,
        lastname: action.payload
      }
    case AUTH_EMAIL_CHANGED:
      return { 
        ...state,
        email: action.payload
      }
    case AUTH_PASSWORD_CHANGED:
      return {
        ...state,
        password: action.payload
      }
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case SIGNUP_USER:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        token: action.payload.token,
        userId: action.payload.userId
      }
    case LOGIN_USER_FAIL:
      return {
        ...state,
        error:  action.payload,
        password: '',
        loading: false
      }
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        token: action.payload.token,
        userId: action.payload.userId
      }
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        password: '',
        loading: false
      }
    case SIGNUP_CLICKED:
      return {
        ...state,
        ...INITIAL_STATE
      }
    case SIGNUP_LEFT_CLICKED:
      return {
        ...state,
        ...INITIAL_STATE
      }
    default:
      return state
  }
}