import axios from 'axios'
import { Actions, ActionConst } from 'react-native-router-flux'
import RNFS from 'react-native-fs'
import { encryptor, decryptor } from '../crypto'
import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS,
  RENDER_LIST,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL,
  RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
  RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
  RENDER_CHAT_FAIL,
  CHAT_INPUT_CHANGED,
  PRIVATE_KEY_FILE_NAME_CHANGED,
  PUBLIC_KEY_FILE_NAME_CHANGED,
  FIND_KEYS,
  FIND_KEYS_SUCCESS,
  FIND_KEYS_FAIL,
  FIND_PUBLIC_KEY_SUCCESS,
  FIND_PUBLIC_KEY_FAIL,
  MESSAGE_SENT_SUCCESSFUL,
  MESSAGE_SENT_FAIL,
  EMPTY_KEYS
} from './types'

export const chatEmailChanged = (text) => {
  return {
    type: CHAT_EMAIL_CHANGED,
    payload: text
  }
}

export const createChat = ({ email, token, userId }) => {
  const { emptyEmail, chatCreationFail } = errorMsgs

  return (dispatch) => {
    dispatch({ type: CREATE_CHAT })

    if(email === '') {
      createChatFail(dispatch, emptyEmail)
    } else {
      const axiosInstance = axios.create({
        headers: {'authorization': token}
      })

      axiosInstance.get(`https://miningforgoldstein.me/userIdByEmail?email=${email}`)
        .then(res => {
          const otherUserID = res.data

          axiosInstance.post('https://miningforgoldstein.me/chat', { otherUserID })
            .then(res => {
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
                          data[index]['otherUserId'] = id

                          if (itemsProcessed === otherUserIds.length) {
                            renderListSuccess(dispatch, data)
                            Actions.pop()
                            dispatch({ type: CREATE_CHAT_SUCCESS })
                          }
                        })
                        .catch(() => {
                          renderListFail(dispatch, listRenderFail)
                          Actions.pop()
                        })
                    })
                  }
                })
                .catch(() => {
                  renderListFail(dispatch, listRenderFail)
                  Actions.pop()
                })
            })
            .catch(() => {
              renderListFail(dispatch, listRenderFail)
              Actions.pop()
            })
        })
        .catch(() => {
            renderListFail(dispatch, listRenderFail)
            Actions.pop()
        })
    }
  }
}

export const renderList = ({ token, userId }) => {
  const { listRenderFail } = errorMsgs

  return (dispatch) => {
    dispatch({ type: RENDER_LIST })

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
                data[index]['otherUserId'] = id
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

export const focusChat = ({ otherUserId, token, otherUserFirstname }) => {
  const { chatRenderFail } = errorMsgs

  return (dispatch) => {
    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })

    axiosInstance.get(`https://miningforgoldstein.me/chat/${otherUserId}`)
      .then(result => {
        storage.load({ key: otherUserId })
          .then((publicKey) => {
            dispatch({
              type: RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
              payload: {
                messages: result.data,
                publicKey,
                otherUserId,
                otherUserFirstname
              }
            })
          })
          .catch(() => {
            dispatch({
              type: RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
              payload: {
                messages: result.data,
                otherUserId,
                otherUserfirstname
              }
            })
          })

        Actions.focusChat({title: otherUserFirstname})
      })
      .catch(() => {
        dispatch({
          type: RENDER_CHAT_FAIL,
          payload: chatRenderFail
        })

        Actions.focusChat()
      })
  }
}

export const chatInputChanged = (text) => {
  return {
    type: CHAT_INPUT_CHANGED,
    payload: text
  }
}

export const sendMessage = ({ input, otherUserId, userId, token, publicKey }) => {
  const { emptyKeys, messageSendError } = errorMsgs

  return ((dispatch) => {
    if(publicKey === '') {
      dispatch({
        type: EMPTY_KEYS,
        payload: emptyKeys
      })
    } else {
      const encryptedObject = encryptor(input, publicKey)

      const axiosInstance = axios.create({
        headers: {'authorization': token}
      })

      axiosInstance.put(`https://miningforgoldstein.me/chat`, { otherUserID: otherUserId, message: encryptedObject })
        .then(() => {
          dispatch({ type: MESSAGE_SENT_SUCCESSFUL })
        })
        .catch(() => {
          dispatch({
            type: MESSAGE_SENT_FAIL,
            payload: messageSendError
          })
        })
    }
  })
}

export const publicKeyFileNameChanged = (text) => {
  return {
    type: PUBLIC_KEY_FILE_NAME_CHANGED,
    payload: text
  }
}

export const findPublicKey = ({ publicKeyFileName, otherUserId }) => {
  const { emptyKeyInput, keyFindFail } = errorMsgs

  return (dispatch) => {
    dispatch({ type: FIND_KEYS })

    if (publicKeyFileName === '') {
      findPublicKeyFail(dispatch, emptyKeyInput)
    } else {
      RNFS.readFile(`${RNFS.ExternalDirectoryPath}/${publicKeyFileName}.txt`)
        .then((publicKey) => {
          storage.save({
            key: otherUserId,
            rawData: { publicKey },
            expires: null
          })

          findPublicKeySuccess(dispatch, publicKey)
        })
        .catch(() => {
          findPublicKeyFail(dispatch, keyFindFail)
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

const findPublicKeySuccess = (dispatch, publicKey) => {
  dispatch({
    type: FIND_PUBLIC_KEY_SUCCESS
    payload: publicKey
  })

  Actions.pop()
}

const findPublicKeyFail = (dispatch, errorMsg) => {
  dispatch({
    type: FIND_PUBLIC_KEY_FAIL
    payload: errorMsg
  })
}

const findKeySuccess = (dispatch, publicKey) => {
  dispatch({
    type: FIND_KEYS_SUCCESS,
    payload: publicKey
  })

  Actions.pop()
}

const findKeyFail = (dispatch, errorMsg) => {
  dispatch({
    type: FIND_KEYS_FAIL,
    payload: errorMsg
  })
}

const errorMsgs = {
  emptyEmail: 'Please enter an email',
  chatCreationFail: 'Chat creation failed',
  listRenderFail: 'Unable to retrieve chats, please try again later',
  chatRenderFail: 'Unable to retrieve chat, please try again later',
  emptyKeyInput: 'Please enter key file name',
  keyFindFail: 'Unable to retrieve key',
  emptyKeys: 'Please provide your key',
  messageSendError: 'Unable to send message'
}