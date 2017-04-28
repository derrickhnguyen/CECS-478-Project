import {
  RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,,
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
  input: EMPTY_STATE,
  chatErrorMsg: EMPTY_STATE,
  otherUserId: EMPTY_STATE,
  otherUserFirstname: EMPTY_STATE,
  publicKeyFileName: EMPTY_STATE,
  publicKey: EMPTY_STATE,
  loading: false,
  keyErrorMsg: EMPTY_STATE
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
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
        ...INITIAL_STATE,
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
        chatErrorMsg: EMPTY_STATE,
        keyErrorMsg: EMPTY_STATE,
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
        chatErrorMsg: EMPTY_STATE,
        keyErrorMsg: EMPTY_STATE,
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
        input: EMPTY_STATE
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