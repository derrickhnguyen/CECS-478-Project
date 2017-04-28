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
    default:
      return state
  }
}