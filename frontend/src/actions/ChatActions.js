import axios from 'axios'
import { Actions } from 'react-native-router-flux'
import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS
} from './types'

export const chatEmailChanged = (text) => {
  return {
    type: CHAT_EMAIL_CHANGED,
    payload: text
  }
}

export const createChat = ({ email, token }) => {
  const { emptyEmail, chatCreationFail } = errorMsgs

  return (dispatch) => {
    dispatch({
      type: CREATE_CHAT
    })

    if(email === '') {
      createChatFail(dispatch, emptyEmail)
    } else {
      const axiosInstance = axios.create({
        headers: {'authorization': token}
      })
      axiosInstance.get(`http:10.0.2.2:5000/userIdByEmail?email=${email}`)
        .then(({ data }) => {
          const otherUserID = data
          axiosInstance.post('http:10.0.2.2:5000/chat', { otherUserID })
            .then((res) => {
              dispatch({
                type: CREATE_CHAT_SUCCESS
              })

              Actions.chatList()
            })
            .catch(() => {
              createChatFail(dispatch, chatCreationFail)
            })
        })
        .catch(() => {
          createChatFail(dispatch, chatCreationFail)
        })
    }
  }
}

const createChatFail = (dispatch, errorMsg) => {
  dispatch({
    type: CREATE_CHAT_FAIL,
    payload: errorMsg
  })
}

const errorMsgs = {
  emptyEmail: 'Please enter an email',
  chatCreationFail: 'Chat creation failed'
}