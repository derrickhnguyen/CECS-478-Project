import {
  RENDER_LIST,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL
} from '../actions/types'

const INITIAL_STATE = {
  listOfChats: [],
  loading: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  console.log(action)
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
        listOfChats: action.payload,
        loading: false
      }
    case RENDER_LIST_FAIL:
      return {
        ...state,
        ...INITIAL_STATE,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}