import * as GLOBAL from '../../global'
import {
  RENDER_LIST,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL,
  RENDER_CHAT,
  RENDER_CHAT_DONE
} from '../actions/types'

const INITIAL_STATE = {
  listOfChats: [],
  loading: false,
  chatListError: GLOBAL.EMPTY_STATE
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch(type) {
    case RENDER_LIST:
      return {
        ...INITIAL_STATE,
        loading: true
      }
    case RENDER_LIST_SUCCESS:
      return {
        ...INITIAL_STATE,
        listOfChats: payload
      }
    case RENDER_LIST_FAIL:
      return {
        ...INITIAL_STATE,
        chatListError: payload
      }
    case RENDER_CHAT:
      return {
        ...state,
        loading: true
      }
    case RENDER_CHAT_DONE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}