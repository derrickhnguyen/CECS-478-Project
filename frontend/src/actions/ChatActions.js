import axios from 'axios'
import { Actions } from 'react-native-router-flux'
import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS,
  RENDER_LIST,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL
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

              Actions.pop()
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

export const renderList = ({ token, userId }) => {
  const { listRenderFail } = errorMsgs

  return (dispatch) => {
    dispatch({
      type: RENDER_LIST
    })

    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })
    axiosInstance.get('http:10.0.2.2:5000/allChat')
      .then(({ data }) => {
        const otherUserIds = data.map(chat => {
          return chat.users.find(id => {
            return id !== userId
          })
        })

        otherUserIds.forEach((id, index) => {
          axiosInstance.get(`http:10.0.2.2:5000/userNameById?id=${id}`)
            .then(result => {
              data[index]['firstname'] = result.data.firstname
              data[index]['lastname'] = result.data.lastname
            })
            .catch(() => {
              renderListFail(dispatch, listeRenderFail)
            })
        })
        renderListSuccess(dispatch, data)
      })
      .catch(() => {
        renderListFail(dispatch, listRenderFail)
      })
  }
}

const createChatFail = (dispatch, errorMsg) => {
  dispatch({
    type: CREATE_CHAT_FAIL,
    payload: errorMsg
  })
}

const renderListSuccess = (dispatch, chats) => {
  dispatch({
    type: RENDER_LIST_SUCCESS,
    payload: chats
  })
}

const renderListFail = (dispatch, errorMsg) => {
  dispatch({
    type: RENDER_LIST_FAIL,
    payload: errorMsg
  })
}

const errorMsgs = {
  emptyEmail: 'Please enter an email',
  chatCreationFail: 'Chat creation failed',
  listRenderFail: 'Unable to retrieve chats'
}