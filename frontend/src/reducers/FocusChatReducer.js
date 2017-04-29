import * as GLOBAL from '../../global'
import {
  RENDER_CHAT_SUCCESS,
  RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
  RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
  RENDER_CHAT_FAIL,
  CHAT_INPUT_CHANGED,
  PUBLIC_KEY_FILE_NAME_CHANGED,
  FIND_KEYS,
  FIND_KEYS_SUCCESS,
  FIND_KEYS_FAIL,
  FIND_PUBLIC_KEY_SUCCESS,
  FIND_PUBLIC_KEY_FAIL,
  MESSAGE_SENT_SUCCESSFUL,
  MESSAGE_SENT_FAIL,
  EMPTY_KEYS
} from '../actions/types'

const INITIAL_STATE = {
  messages: [],
  input: GLOBAL.EMPTY_STATE,
  chatErrorMsg: GLOBAL.EMPTY_STATE,
  otherUserId: GLOBAL.EMPTY_STATE,
  otherUserFirstname: GLOBAL.EMPTY_STATE,
  publicKeyFileName: GLOBAL.EMPTY_STATE,
  publicKey: GLOBAL.EMPTY_STATE,
  loading: false,
  keyErrorMsg: GLOBAL.EMPTY_STATE,
  dataSource: GLOBAL.EMPTY_STATE
}

export default (state = INITIAL_STATE, action) => {
  console.log(action)
  const { type, payload } = action
  switch (type) {
    case RENDER_CHAT_SUCCESS: {
      return {
        ...state,
        messages: payload.messages,
        dataSource: payload.dataSource
      }
    }
    case RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY:
      return {
        ...INITIAL_STATE,
        messages: payload.messages,
        otherUserId: payload.otherUserId,
        otherUserFirstname: payload.otherUserFirstname,
        publicKey: payload.publicKey,
      }
    case RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY:
      return {
        ...INITIAL_STATE,
        messages: payload.messages,
        otherUserId: payload.otherUserId,
        otherUserFirstname: payload.otherUserFirstname
      }
    case RENDER_CHAT_FAIL:
      return {
        ...state,
        chatErrorMsg: payload
      }
    case CHAT_INPUT_CHANGED:
      return {
        ...state,
        input: payload
      }
    case PUBLIC_KEY_FILE_NAME_CHANGED:
      return {
        ...state,
        publicKeyFileName: payload
      }
    case FIND_KEYS:
      return {
        ...state,
        loading: true
      }
    case FIND_KEYS_SUCCESS:
      return {
        ...state,
        loading: false,
        chatErrorMsg: GLOBAL.EMPTY_STATE,
        keyErrorMsg: GLOBAL.EMPTY_STATE,
        publicKey: payload
      }
    case FIND_KEYS_FAIL:
      return {
        ...state,
        loading: false,
        keyErrorMsg: payload
      }
    case FIND_PUBLIC_KEY_SUCCESS:
      return {
        ...state,
        loading: false,
        chatErrorMsg: GLOBAL.EMPTY_STATE,
        keyErrorMsg: GLOBAL.EMPTY_STATE,
        publicKey: payload
      }
    case FIND_PUBLIC_KEY_FAIL:
      return {
        ...state,
        loading: false,
        keyErrorMsg: payload
      }
    case MESSAGE_SENT_SUCCESSFUL:
      return {
        ...state,
        input: GLOBAL.EMPTY_STATE
      }
    case MESSAGE_SENT_FAIL:
      return {
        ...state,
        chatErrorMsg: payload
      }
    case EMPTY_KEYS:
      return {
        ...state,
        chatErrorMsg: payload
      }
    default:
      return state
  }
}