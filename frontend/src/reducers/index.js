import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'
import ChatFormReducer from './ChatFormReducer'
import ChatListReducer from './ChatListReducer'

export default combineReducers({
  auth: AuthReducer,
  chatForm: ChatFormReducer,
  chatList: ChatListReducer
}) 