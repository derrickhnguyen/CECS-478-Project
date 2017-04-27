import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS
} from '../actions/types'

const INITIAL_STATE = {
  email: '',
  loading: false,
  chatFormError: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHAT_EMAIL_CHANGED:
      return {
        ...state,
        email: action.payload
      }
    case CREATE_CHAT:
      return {
        ...state,
        INITIAL_STATE,
        loading: true
      }
    case CREATE_CHAT_FAIL:
      return {
        ...state,
        ...INITIAL_STATE,
        loading: false,
        chatFormError: action.payload
      }
    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        loading: false
      }
    default:
      return state
  }
}