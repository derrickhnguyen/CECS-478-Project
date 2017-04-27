import axios from 'axios'
import { Actions, ActionConst } from 'react-native-router-flux'
import RNFS from 'react-native-fs'
import { AsyncStorage } from 'react-native'
import Storage from 'react-native-storage'
import { encryptor, decryptor } from '../crypto'
import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS,
  RENDER_LIST,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL,
  RENDER_CHAT_SUCCESS,
  RENDER_CHAT_FAIL,
  CHAT_INPUT_CHANGED,
  PRIVATE_KEY_FILE_NAME_CHANGED,
  PUBLIC_KEY_FILE_NAME_CHANGED,
  FIND_KEYS,
  FIND_KEYS_SUCCESS,
  FIND_KEYS_FAIL,
  MESSAGE_SENT,
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
                            dispatch({
                              type: CREATE_CHAT_SUCCESS
                            })
                            Actions.pop()
                            renderListSuccess(dispatch, data)
                          }
                        })
                        .catch(() => {
                          Actions.pop()
                          renderListFail(dispatch, listRenderFail)
                        })
                    })
                  }
                })
                .catch(() => {
                  Actions.pop()
                  renderListFail(dispatch, listRenderFail)
                })
            })
            .catch(() => {
              Actions.pop()
              renderListFail(dispatch, listRenderFail)
            })
        })
        .catch(() => {
            Actions.pop()
            renderListFail(dispatch, listRenderFail)
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
        dispatch({
          type: RENDER_CHAT_SUCCESS,
          payload: {
            messages: result.data,
            otherUserId,
            otherUserFirstname
          }
        })

        Actions.focusChat({title: otherUserFirstname})
      })
      .catch((error) => {
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
  const { emptyKeys } = errorMsgs

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
        .then((response) => {
          dispatch({
            type: MESSAGE_SENT
          })

          const storage = new Storage({
            size: 1000,
            storageBackend: AsyncStorage,
            defaulExpires: null,
            enableCache: true
          })

          storage.save({
            key: `${otherUserId}`,
            rawData: {
              message: input
            },
            expires: null
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
}

export const privateKeyFileNameChanged = (text) => {
  return {
    type: PRIVATE_KEY_FILE_NAME_CHANGED,
    payload: text
  }
}

export const publicKeyFileNameChanged = (text) => {
  return {
    type: PUBLIC_KEY_FILE_NAME_CHANGED,
    payload: text
  }
}

export const findKeys = ({ privateKeyFileName, publicKeyFileName }) => {
  const { emptyKeyInputs, keyFindFail } = errorMsgs

  return (dispatch) => {
    dispatch({
      type: FIND_KEYS
    })

    if (privateKeyFileName === '' || publicKeyFileName === '') {
      findKeyFail(dispatch, emptyKeyInputs)
    } else {
      RNFS.readFile(`${RNFS.ExternalDirectoryPath}/${privateKeyFileName}.txt`)
        .then((privFile) => {
          RNFS.readFile(`${RNFS.ExternalDirectoryPath}/${publicKeyFileName}.txt`)
            .then((pubFile) => {
              dispatch({
                type: FIND_KEYS_SUCCESS,
                payload: {
                  privateKey: privFile,
                  publicKey: pubFile
                }
              })

              Actions.pop()
            })
            .catch((err) => {
              findKeyFail(dispatch, keyFindFail)
            })
        })
        .catch((err) => {
          findKeyFail(dispatch, keyFindFail)
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

const findKeyFail = (dispatch, errorMsg) => {
  dispatch({
    type: FIND_KEYS_FAIL,
    payload: errorMsg
  })
}

const errorMsgs = {
  emptyEmail: 'Please enter an email',
  chatCreationFail: 'Chat creation failed',
  listRenderFail: 'Unable to retrieve chats',
  chatRenderFail: 'Unable to retrieve chat',
  emptyKeyInputs: 'Please enter key file names',
  keyFindFail: 'Unable to retrieve keys',
  emptyKeys: 'Please provide your keys'
}