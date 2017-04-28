import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS
} from '../actions/types'

const INITIAL_STATE = {
  email: EMPTY_STATE,
  loading: false,
  chatFormError: EMPTY_STATE
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case CHAT_EMAIL_CHANGED:
      return {
        ...state,
        email: payload
      }
    case CREATE_CHAT:
      return {
        ...INITIAL_STATE,
        loading: true
      }
    case CREATE_CHAT_FAIL:
      return {
        ...INITIAL_STATE,
        chatFormError: payload
      }
    case CREATE_CHAT_SUCCESS:
      return {
        ...INITIAL_STATE
      }
    default:
      return state
  }
}