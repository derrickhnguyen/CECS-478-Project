import * as GLOBAL from '../../global'
import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS
} from '../actions/types'

// The initial states for all the variables
// in this reducer.
const INITIAL_STATE = {
  email: GLOBAL.EMPTY_STATE,
  loading: false,
  chatFormError: GLOBAL.EMPTY_STATE
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    // Alter only email, everything else 
    // remains unchanged.
    case CHAT_EMAIL_CHANGED:
      return {
        ...state,
        email: payload
      }
    // loading will be set to true, everything
    // else will revert back to their initial
    // states.
    case CREATE_CHAT:
      return {
        ...INITIAL_STATE,
        loading: true
      }
    // chatFormError will be set to its new state.
    // Everything else will revert back to their initial
    // states.
    case CREATE_CHAT_FAIL:
      return {
        ...INITIAL_STATE,
        chatFormError: payload
      }
    // Everything else will revert back to their initial
    // states.
    case CREATE_CHAT_SUCCESS:
      return {
        ...INITIAL_STATE
      }
    default:
      return state
  }
}