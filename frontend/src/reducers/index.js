import { combineReducers } from 'redux'
import ChatReducer from './ChatReducer'
import MessageReducer from './MessageReducer'
import TokenReducer from './TokenReducer'
import SelectionReducer from './SelectionReducer'
import AuthReducer from './AuthReducer'

export default combineReducers({
  chats: ChatReducer,
  messages: MessageReducer,
  token: TokenReducer,
  selectedChat: SelectionReducer,
  auth: AuthReducer
}) 