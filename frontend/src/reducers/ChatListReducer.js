import {
  RENDER_LIST,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL
} from '../actions/types'

const INITIAL_STATE = {
  listOfChats: [],
  loading: false,
  chatListError: ''
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case RENDER_LIST:
      return {
        ...state,
        ...INITIAL_STATE,
        loading: true
      }
    case RENDER_LIST_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        listOfChats: action.payload
      }
    case RENDER_LIST_FAIL:
      return {
        ...state,
        ...INITIAL_STATE,
        chatListError: action.payload
      }
    default:
      return state
  }
}