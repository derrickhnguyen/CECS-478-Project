import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'
import ChatFormReducer from './ChatFormReducer'
import ChatListReducer from './ChatListReducer'
import FocusChatReducer from './FocusChatReducer'

export default combineReducers({
  auth: AuthReducer,
  chatForm: ChatFormReducer,
  chatList: ChatListReducer,
  focusChat: FocusChatReducer
}) 