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
      axiosInstance.get(`https://miningforgoldstein.me/userIdByEmail?email=${email}`)
        .then(({ data }) => {
          const otherUserID = data
          axiosInstance.post('https://miningforgoldstein.me/chat', { otherUserID })
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
    axiosInstance.get('https://miningforgoldstein.me/allChat')
      .then(({ data }) => {
        if (data.length === 0) {
          renderListSuccess(dispatch, data)
        } else {
          const otherUserIds = data.map(chat => {
            return chat.users.find(id => {
              return id !== userId
            })
          })

          let itemsProcessed = 0
          otherUserIds.forEach((id, index) => {
            axiosInstance.get(`https://miningforgoldstein.me/userNameById?id=${id}`)
              .then(result => {
                itemsProcessed++
                data[index]['firstname'] = result.data.firstname
                data[index]['lastname'] = result.data.lastname
                if (itemsProcessed === otherUserIds.length) {
                  renderListSuccess(dispatch, data)
                }
              })
              .catch(() => {
                renderListFail(dispatch, listRenderFail)
              })
          })
        }
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