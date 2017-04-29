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

/*
* Triggers when new chat email input changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const chatEmailChanged = (text) => {
  return {
    type: CHAT_EMAIL_CHANGED,
    payload: text
  }
}

/*
* Creates a new chat with user's email input.
* If successful, a new chat will be posted onto the main screen
* If not, then an client error message will appear.
* 
* @param {object} = { email:String, token:String, userId:String }
*/
export const createChat = ({ email, token, userId }) => {
  // Extract error messages from object.
  const { emptyEmail, chatCreationFail } = errorMsgs

  return (dispatch) => {
    // Send an action type of CREATE_CHAT to indicate
    // that request is being processed.
    dispatch({ type: CREATE_CHAT })

    // Make sure user inputs anything.
    if(email === EMPTY_STATE) {
      // Repond with the appropriate reponse
      // if users does not input anything.
      createChatFail(dispatch, emptyEmail)
    } else {
      // To make an HTTP request, there must be a token
      // in the header.
      const axiosInstance = axios.create({
        headers: {'authorization': token}
      })

      // Make a GET request to retrieve the other user's ID.
      axiosInstance.get(`https://miningforgoldstein.me/userIdByEmail?email=${email}`)
        .then(res => {
          // If request was successful...
          const otherUserID = res.data

          // Make a POST request to generate a new chat with the user.
          axiosInstance.post('https://miningforgoldstein.me/chat', { otherUserID })
            .then(() => {
              // If POST request was successful, repopulate the chat list by
              // calling a GET request to to retrieve all of the active chats.
              axiosInstance.get('https://miningforgoldstein.me/allChat')
                .then(({ data }) => {
                  // If the data array is empty, return.
                  if (data.length === 0) {
                    renderListSuccess(dispatch, data)
                  } else {
                    // If the data array is not empty, retrive all of the IDs
                    // that is not the user and create an array out of it.
                    const otherUserIds = data.map(chat => {
                      return chat.users.find(id => {
                        return id !== userId
                      })
                    })

                    let itemsProcessed = 0

                    // Do a for-loop for each other users ID.
                    otherUserIds.forEach((id, index) => {
                      // Make a GET request for each other users ID, and add their firstname,
                      // lastname, and id into each entry of the users entry.
                      axiosInstance.get(`https://miningforgoldstein.me/userNameById?id=${id}`)
                        .then(result => {
                          itemsProcessed++
                          data[index]['firstname'] = result.data.firstname
                          data[index]['lastname'] = result.data.lastname
                          data[index]['otherUserId'] = id

                          // Once all of the entries have been entered, return
                          // the appropriate response.
                          if (itemsProcessed === otherUserIds.length) {
                            renderListSuccess(dispatch, data)
                            Actions.pop()
                            dispatch({ type: CREATE_CHAT_SUCCESS })
                          }
                        })
                        .catch(() => {
                          // If the GET request to retrieve user's name is
                          // unsuccessful, return the appropriate error
                          // response.
                          renderListFail(dispatch, listRenderFail)
                          Actions.pop()

                          // Break out of the for-loop.
                          break;
                        })
                    })
                  }
                })
                .catch(() => {
                  // If the GET request to retrieve all of the user's chat fails,
                  // return the appropriate error response.
                  renderListFail(dispatch, listRenderFail)
                  Actions.pop()
                })
            })
            .catch(() => {
              // If the POST request to add a new chat fails,
              // return the appropriate error reponse.
              renderListFail(dispatch, listRenderFail)
              Actions.pop()
            })
        })
        .catch(() => {
          // If the GET request to retrieve the other user's ID fails,
          // return the appropriate error response.
          renderListFail(dispatch, listRenderFail)
          Actions.pop()
        })
    }
  }
}

/*
* Renders the list of active chats.
* 
* @param {object} = { token:String, userId:String }
*/
export const renderList = ({ token, userId }) => {
  // Extract error messages from object.
  const { listRenderFail } = errorMsgs

  return (dispatch) => {
    // Send an action type of RENDER_LIST to indicate
    // that request is being processed.
    dispatch({ type: RENDER_LIST })

    // To make an HTTP request, there must be a token
    // in the header.
    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })

    // Make a GET request to to retrieve all of the active chats.
    axiosInstance.get('https://miningforgoldstein.me/allChat')
      .then(({ data }) => {
        if (data.length === 0) {
          // If the data array is empty, return.
          renderListSuccess(dispatch, data)
        } else {
          // If the data array is not empty, retrive all of the IDs
          // that is not the user and create an array out of it.
          const otherUserIds = data.map(chat => {
            return chat.users.find(id => {
              return id !== userId
            })
          })

          let itemsProcessed = 0

          // Do a for-loop for each other users ID.
          otherUserIds.forEach((id, index) => {
            // Make a GET request for each other users ID, and add their firstname,
            // lastname, and id into each entry of the users entry.
            axiosInstance.get(`https://miningforgoldstein.me/userNameById?id=${id}`)
              .then(result => {
                itemsProcessed++
                data[index]['firstname'] = result.data.firstname
                data[index]['lastname'] = result.data.lastname
                data[index]['otherUserId'] = id
                if (itemsProcessed === otherUserIds.length) {
                  // Once all of the entries have been entered, return
                  // the appropriate response.
                  renderListSuccess(dispatch, data)
                }
              })
              .catch(() => {
                // If the GET request to retrieve user's name is
                // unsuccessful, return the appropriate error
                // response.
                renderListFail(dispatch, listRenderFail)
              })
          })
        }
      })
      .catch(() => {
        // If the GET request to retrieve all of the user's chat fails,
        // return the appropriate error response.
        renderListFail(dispatch, listRenderFail)
      })
  }
}

/*
* Renders the focus chat.
* 
* @param {object} = { otherUserId:String, token:String, otherUserFirstname:String }
*/
export const focusChat = ({ otherUserId, token, otherUserFirstname }) => {
  // Extract error messages from object.
  const { chatRenderFail } = errorMsgs

  return (dispatch) => {
    // To make an HTTP request, there must be a token
    // in the header.
    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })

    // Make a GET request to retrieve chat with current user.
    axiosInstance.get(`https://miningforgoldstein.me/chat/${otherUserId}`)
      .then(result => {
        // If GET request is successful, find the other user's public
        // key in local storage.
        storage.load({ key: otherUserId })
          .then(({ publicKey }) => {
            // If public key is in local storage, then dispatch
            // a response to change states appropriately.
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
            // If public key is not in local storage, then dispatch
            // a response to change states appropriately, but without
            // public key.
            dispatch({
              type: RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
              payload: {
                messages: result.data,
                otherUserId,
                otherUserfirstname
              }
            })
          })

        // Switch screen to focus chat screen.
        Actions.focusChat({title: otherUserFirstname})
      })
      .catch(() => {
        // If GET request to retrieve current chat is unsuccessful,
        // dispatch the appropriate error response.
        dispatch({
          type: RENDER_CHAT_FAIL,
          payload: chatRenderFail
        })

        // Switch screen to focus chat screen.
        Actions.focusChat()
      })
  }
}

/*
* Triggers when chat input changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const chatInputChanged = (text) => {
  return {
    type: CHAT_INPUT_CHANGED,
    payload: text
  }
}

/*
* Renders the focus chat.
* 
* @param {object} = { otherUserId:String, token:String, otherUserFirstname:String }
*/   
export const sendMessage = ({ input, otherUserId, userId, token, publicKey }) => {
  // Extract error messages from object.
  const { emptyKeys, messageSendError } = errorMsgs

  return ((dispatch) => {
    if(publicKey === EMPTY_STATE) {
      // Dispatch an client error response
      // if there is no public key.
      dispatch({
        type: EMPTY_KEYS,
        payload: emptyKeys
      })
    } else {
      // Encrypt message
      const encryptedObject = encryptor(input, publicKey)

      // To make an HTTP request, there must be a token
      // in the header.
      const axiosInstance = axios.create({
        headers: {'authorization': token}
      })

      // Make a PUT request to add new message to chat.
      axiosInstance.put(`https://miningforgoldstein.me/chat`, { otherUserID: otherUserId, message: encryptedObject })
        .then(() => {
          // If PUT request is successful, dispatch the appropriate response.
          dispatch({ type: MESSAGE_SENT_SUCCESSFUL })
        })
        .catch(() => {
          // If PUT request is unsuccessful, dispatch the
          // appripriate client error response.
          dispatch({
            type: MESSAGE_SENT_FAIL,
            payload: messageSendError
          })
        })
    }
  })
}

/*
* Triggers when public key file name changes.
* 
* @param   {String}   text
* @return  {Object}   
*/
export const publicKeyFileNameChanged = (text) => {
  return {
    type: PUBLIC_KEY_FILE_NAME_CHANGED,
    payload: text
  }
}

/*
* Checks if public key is on user's phone.
* 
* @param {object} = { publicKeyFileName:String, otherUserId:String }
*/   
export const findPublicKey = ({ publicKeyFileName, otherUserId }) => {
  // Extract error messages from object.
  const { emptyKeyInput, keyFindFail } = errorMsgs

  return (dispatch) => {
    // Send an action type of FIND_KEYS to indicate
    // that request is being processed.
    dispatch({ type: FIND_KEYS })

    if (publicKeyFileName === EMPTY_STATE) {
      // Send the appropriate client error response
      // if user inputs empty.
      findPublicKeyFail(dispatch, emptyKeyInput)
    } else {
      // Read file path that user inputted and check the appropriate folder.
      RNFS.readFile(`${RNFS.ExternalDirectoryPath}/${publicKeyFileName}.txt`)
        .then((publicKey) => {
          // If the file is found, save it in local storage.
          storage.save({
            key: otherUserId,
            rawData: { publicKey },
            expires: null
          })

          // Send the appropriate success response.
          findPublicKeySuccess(dispatch, publicKey)
        })
        .catch(() => {
          // If the file was unable to be read, send the appropriate
          // client error response.
          findPublicKeyFail(dispatch, keyFindFail)
        })
    }
  }
}

/*
* Helper function to dispatch CREATE_CHAT_FAIL
* type. It will return the appropriate error
* message to the user's screen.
* 
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
const createChatFail = (dispatch, errorMsg) => {
  dispatch({
    type: CREATE_CHAT_FAIL,
    payload: errorMsg
  })
}

/*
* Helper function to dispatch RENDER_LIST_SUCCESS
* type. It will return the appropriate data to
* populate the user's screen.
* 
* @param    {function}    dispatch
* @param    {Object}      chats
*/
const renderListSuccess = (dispatch, chats) => {
  dispatch({
    type: RENDER_LIST_SUCCESS,
    payload: chats
  })
}

/*
* Helper function to dispatch RENDER_LIST_FAIL
* type. It will return the appropriate error
* message to the user's screen.
* 
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
const renderListFail = (dispatch, errorMsg) => {
  dispatch({
    type: RENDER_LIST_FAIL,
    payload: errorMsg
  })
}

/*
* Helper function to dispatch FIND_PUBLIC_KEY_SUCCESS
* type. It will return the public key to the reducer
* states. 
*
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
const findPublicKeySuccess = (dispatch, publicKey) => {
  dispatch({
    type: FIND_PUBLIC_KEY_SUCCESS
    payload: publicKey
  })

  Actions.pop()
}

/*
* Helper function to dispatch FIND_PUBLIC_KEY_FAIL
* type. It will return the appropriate error
* message to the user's screen.
* 
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
const findPublicKeyFail = (dispatch, errorMsg) => {
  dispatch({
    type: FIND_PUBLIC_KEY_FAIL
    payload: errorMsg
  })
}

/*
* Helper function to dispatch FIND_KEYS_SUCCESS
* type. It will return the public key to the reducer
* states. 
*
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
const findKeySuccess = (dispatch, publicKey) => {
  dispatch({
    type: FIND_KEYS_SUCCESS,
    payload: publicKey
  })

  Actions.pop()
}

/*
* Helper function to dispatch FIND_KEYS_FAIL
* type. It will return the appropriate error
* message to the user's screen.
* 
* @param    {function}    dispatch
* @param    {String}      errorMsg
*/
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