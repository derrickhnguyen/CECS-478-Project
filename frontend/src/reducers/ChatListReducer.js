import * as GLOBAL from '../../global'
import {
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL,
  RENDER_CHAT,
  RENDER_CHAT_DONE,
  SET_CHAT_LIST_INTERVAL_ID,
  REMOVE_CHAT_LIST_INTERVAL_ID
} from '../actions/types'

// The initial states for all the variables
// in this reducer.
const INITIAL_STATE = {
  listOfChats: [],
  loading: false,
  chatListError: GLOBAL.EMPTY_STATE,
  chatListIntervalId: GLOBAL.EMPTY_STATE
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch(type) {
    // listOfChats will be set to new state. Everything
    // else will revert back to its initial states.
    case RENDER_LIST_SUCCESS:
      return {
        ...state,
        listOfChats: payload,
        loading: false,
        chatListError: GLOBAL.EMPTY_STATE,
      }
    // chatListError will be set to new state. Everything
    // else will revert back to its initial states.
    case RENDER_LIST_FAIL:
      return {
        ...INITIAL_STATE,
        listOfChats: [],
        loading: false,
        chatListError: payload
      }
    // loading will be set to true. Everything else will
    // remain unchanged.
    case RENDER_CHAT:
      return {
        ...state,
        loading: true
      }
    // loading will revert back to false. Everything else will
    // remain unchanged.
    case RENDER_CHAT_DONE:
      return {
        ...state,
        loading: false
      }
    // chatListIntervalId will be set to new state.
    case SET_CHAT_LIST_INTERVAL_ID:
      return {
        ...state,
        chatListIntervalId: payload
      }
    // chatListIntervalId will revert hack to initial state.
    case REMOVE_CHAT_LIST_INTERVAL_ID:
      return {
        ...state,
        chatListIntervalId: GLOBAL.EMPTY_STATE
      }
    default:
      return state
  }
}