import * as GLOBAL from '../../global'
import {
  RENDER_CHAT_SUCCESS,
  RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
  RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
  RENDER_CHAT_FAIL,
  UPDATE_CHAT,
  CHAT_INPUT_CHANGED,
  PUBLIC_KEY_FILE_NAME_CHANGED,
  FIND_PUBLIC_KEY,
  FIND_PUBLIC_KEY_SUCCESS,
  FIND_PUBLIC_KEY_FAIL,
  MESSAGE_SENT_SUCCESSFUL,
  MESSAGE_SENT_FAIL,
  SET_FOCUS_CHAT_INTERVAL_ID,
  REMOVE_FOCUS_CHAT_INTERVAL_ID
} from '../actions/types'

// The initial states for all the variables
// in this reducer.
const INITIAL_STATE = {
  messages: [],
  input: GLOBAL.EMPTY_STATE,
  chatErrorMsg: GLOBAL.EMPTY_STATE,
  otherUserId: GLOBAL.EMPTY_STATE,
  otherUserFirstname: GLOBAL.EMPTY_STATE,
  publicKeyFileName: GLOBAL.EMPTY_STATE,
  publicKey: GLOBAL.EMPTY_STATE,
  keyErrorMsg: GLOBAL.EMPTY_STATE,
  dataSource: GLOBAL.EMPTY_STATE,
  focusChatIntervalId: GLOBAL.EMPTY_STATE,
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  console.log(action)
  const { type, payload } = action
  switch (type) {
    // messages and dataSource will be set to new states.
    case RENDER_CHAT_SUCCESS: {
      return {
        ...state,
        messages: payload.messages,
        dataSource: payload.dataSource
      }
    }
    // messages, otherUserId, otherUserFirstname, and publicKey
    // will be set to new states.
    //
    // Everything else will revert back to their initial states.
    case RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY:
      return {
        ...INITIAL_STATE,
        messages: payload.messages,
        otherUserId: payload.otherUserId,
        otherUserFirstname: payload.otherUserFirstname,
        publicKey: payload.publicKey
      }
    // messages, otherUserId, and otherUserFirstname will be
    // set to new states.
    //
    // Everything else will revert back to their initial states.
    case RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY:
      return {
        ...INITIAL_STATE,
        messages: payload.messages,
        otherUserId: payload.otherUserId,
        otherUserFirstname: payload.otherUserFirstname
      }
    // charErrorMsg will be set to new state.
    case RENDER_CHAT_FAIL:
      return {
        ...state,
        chatErrorMsg: payload
      }
    case UPDATE_CHAT:
      return {
        ...state
      }
    // input will be set to new state.
    case CHAT_INPUT_CHANGED:
      return {
        ...state,
        input: payload
      }
    // publicKeyFileName will be set to new state.
    case PUBLIC_KEY_FILE_NAME_CHANGED:
      return {
        ...state,
        publicKeyFileName: payload
      }
    // loading will be set to true.
    case FIND_PUBLIC_KEY:
      return {
        ...state,
        loading: true
      }
    // publicKey will be set to new state.
    //
    // Error messages will be emptied.
    //
    // loading will revert back to false.
    case FIND_PUBLIC_KEY_SUCCESS:
      return {
        ...state,
        loading: false,
        chatErrorMsg: GLOBAL.EMPTY_STATE,
        keyErrorMsg: GLOBAL.EMPTY_STATE,
        publicKey: payload
      }
    // loading will revert back to false.
    //
    // keyErrorMsg will be set to new state.
    case FIND_PUBLIC_KEY_FAIL:
      return {
        ...state,
        loading: false,
        keyErrorMsg: payload
      }
    // input will be emptied.
    case MESSAGE_SENT_SUCCESSFUL:
      return {
        ...state,
        input: GLOBAL.EMPTY_STATE
      }
    // chatErrorMsg will receive new state.
    case MESSAGE_SENT_FAIL:
      return {
        ...state,
        chatErrorMsg: payload
      }
    // focusChatIntervalId will be set to new state.
    case SET_FOCUS_CHAT_INTERVAL_ID:
      return {
        ...state,
        focusChatIntervalId: payload
      }
    // focusChatIntervalId will be emptied.
    case REMOVE_FOCUS_CHAT_INTERVAL_ID:
      return {
        ...state,
        focusChatIntervalId: GLOBAL.EMPTY_STATE
      }
    default:
      return state
  }
}