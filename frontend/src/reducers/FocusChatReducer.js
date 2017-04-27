import {
  RENDER_CHAT_SUCCESS,
  RENDER_CHAT_FAIL,
  CHAT_INPUT_CHANGED,
  PRIVATE_KEY_FILE_NAME_CHANGED,
  PUBLIC_KEY_FILE_NAME_CHANGED,
  FIND_KEYS,
  FIND_KEYS_SUCCESS,
  FIND_KEYS_FAIL,
  MESSAGE_SENT,
  EMPTY_KEYS
} from '../actions/types'

const INITIAL_STATE = {
  messages: [],
  input: '',
  chatErrorMsg: '',
  otherUserId: '',
  privateKeyFileName: '',
  publicKeyFileName: '',
  privateKey: '',
  publicKey: '',
  loading: false,
  keyErrorMsg: '',
  otherUserFirstname: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RENDER_CHAT_SUCCESS:
      return {
        ...state,
        messages: action.payload.messages,
        input: '',
        chatErrorMsg: '',
        otherUserId: action.payload.otherUserId,
        privateKeyFileName: '',
        publicKeyFileName: '',
        privateKey: '',
        publicKey: '',
        loading: false,
        keyErrorMsg: '',
        otherUserFirstname: action.payload.otherUserFirstname
      }
    case RENDER_CHAT_FAIL:
      return {
        ...state,
        ...INITIAL_STATE,
        chatErrorMsg: action.payload
      }
    case CHAT_INPUT_CHANGED:
      return {
        ...state,
        input: action.payload
      }
    case PRIVATE_KEY_FILE_NAME_CHANGED:
      return {
        ...state,
        privateKeyFileName: action.payload
      }
    case PUBLIC_KEY_FILE_NAME_CHANGED:
      return {
        ...state,
        publicKeyFileName: action.payload
      }
    case FIND_KEYS:
      return {
        ...state,
        loading: true
      }
    case FIND_KEYS_FAIL:
      return {
        ...state,
        ...INITIAL_STATE,
        loading: false,
        keyErrorMsg: action.payload
      }
    case FIND_KEYS_SUCCESS:
      return {
        ...state,
        chatErrorMsg: '',
        loading: false,
        keyErrorMsg: '',
        privateKey: action.payload.privateKey,
        publicKey: action.payload.publicKey
      }
    case MESSAGE_SENT:
      return {
        ...state,
        input: ''
      }
    case EMPTY_KEYS:
      return {
        ...state,
        chatErrorMsg: action.payload
      }
    default:
      return state
  }
}