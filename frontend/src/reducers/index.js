import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'
import ChatFormReducer from './ChatFormReducer'

export default combineReducers({
  auth: AuthReducer,
  chatForm: ChatFormReducer
}) 