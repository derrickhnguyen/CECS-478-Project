import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'
import ChatFormReducer from './ChatFormReducer'
import ChatListReducer from './ChatListReducer'
import FocusChatReducer from './FocusChatReducer'

/* * * * * * * * * * * * * * * * * * * * * * * * * */
/*   The Reducer is a function that transforms     */
/*   current states into new states based on       */
/*   action types.                                 */
/*                                                 */
/*   The key/value pairs below are all objects     */
/*   that hold multiple states that are used       */
/*   throughout the entire application.            */
/* * * * * * * * * * * * * * * * * * * * * * * * * */
export default combineReducers({
  auth: AuthReducer,
  chatForm: ChatFormReducer,
  chatList: ChatListReducer,
  focusChat: FocusChatReducer
}) 