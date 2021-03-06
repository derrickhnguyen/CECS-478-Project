import { ListView } from 'react-native'
import axios from 'axios'
import { Actions, ActionConst } from 'react-native-router-flux'
import RNFS from 'react-native-fs'
import { encryptor, decryptor } from '../crypto'
import * as GLOBAL from '../../global'
import {
  CHAT_EMAIL_CHANGED,
  CREATE_CHAT,
  CREATE_CHAT_FAIL,
  CREATE_CHAT_SUCCESS,
  RENDER_LIST_SUCCESS,
  RENDER_LIST_FAIL,
  RENDER_CHAT,
  RENDER_CHAT_DONE,
  RENDER_CHAT_SUCCESS,
  RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
  RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
  RENDER_CHAT_FAIL,
  UPDATE_CHAT,
  CHAT_INPUT_CHANGED,
  PRIVATE_KEY_FILE_NAME_CHANGED,
  PUBLIC_KEY_FILE_NAME_CHANGED,
  FIND_PUBLIC_KEY,
  FIND_PUBLIC_KEY_SUCCESS,
  FIND_PUBLIC_KEY_FAIL,
  MESSAGE_SENT_SUCCESSFUL,
  MESSAGE_SENT_FAIL,
  SET_FOCUS_CHAT_INTERVAL_ID,
  REMOVE_FOCUS_CHAT_INTERVAL_ID,
  SET_CHAT_LIST_INTERVAL_ID,
  REMOVE_CHAT_LIST_INTERVAL_ID
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
  const { emptyEmail, chatCreationFail, listRenderFail } = errorMsgs

  return (dispatch) => {
    // Send an action type of CREATE_CHAT to indicate
    // that request is being processed.
    dispatch({ type: CREATE_CHAT })

    // Make sure user does not have empty inputs.
    if(email === GLOBAL.EMPTY_STATE) {
      // Respond with the appropriate response
      // if users does not input anything.
      createChatFail(dispatch, emptyEmail)
    } else {
      // To make an HTTP request, there must be a token
      // in the header.
      const axiosInstance = axios.create({
        headers: {'authorization': token}
      })

      // Make a GET request to retrieve the ID of the user that the client would like
      // to communicate with.
      axiosInstance.get(`https://miningforgoldstein.me/userIdByEmail?email=${email}`)
        .then(res => {
          // If request was successful, extract the user's ID.
          const otherUserID = res.data

          // Make a POST request to generate a new chat with the user.
          axiosInstance.post('https://miningforgoldstein.me/chat', { otherUserID })
            .then(() => {
              // If POST request was successful, repopulate the chat list by
              // calling a GET request to retrieve all of the active chats.
              axiosInstance.get('https://miningforgoldstein.me/allChat')
                .then(({ data }) => {
                  // If the data array is empty, simply return.
                  if (data.length === 0) {
                    renderListSuccess(dispatch, data)
                  } else {
                    // If the data array is not empty, retrive all of the IDs
                    // that is not the client and create an array out of it.
                    const otherUserIds = data.map(chat => {
                      return chat.users.find(id => {
                        return id !== userId
                      })
                    })

                    // Use this variable as a counter.
                    let itemsProcessed = 0

                    // Do a for-loop for each users ID.
                    otherUserIds.forEach((id, index) => {
                      // Make a GET request for each users ID, add their firstname,
                      // lastname, and id into each entry of the response.
                      axiosInstance.get(`https://miningforgoldstein.me/userNameById?id=${id}`)
                        .then(result => {
                          itemsProcessed++
                          data[index]['firstname'] = result.data.firstname
                          data[index]['lastname'] = result.data.lastname
                          data[index]['otherUserId'] = id

                          // Once all of the entries have been entered, return
                          // the appropriate response, send the appropriate
                          // success response.
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
              createChatFail(dispatch, chatCreationFail)
            })
        })
        .catch(() => {
          // If the GET request to retrieve the other user's ID fails,
          // return the appropriate error response.
          createChatFail(dispatch, chatCreationFail)
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
    // To make an HTTP request, there must be a token
    // in the header.
    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })
    
    // Make a GET request to to retrieve all of the active chats.
    axiosInstance.get('https://miningforgoldstein.me/allChat')
      .then(({ data }) => {
        if (data.length === 0) {
          // If the data array is empty, simply return.
          renderListSuccess(dispatch, data)
        } else {
          // If the data array is not empty, retrive all of the IDs
          // that is not the user and create an array out of it.
          const otherUserIds = data.map(chat => {
            return chat.users.find(id => {
              return id !== userId
            })
          })

          // Use this variable as a counter.
          let itemsProcessed = 0

          // Do a for-loop for each other users ID.
          otherUserIds.forEach((id, index) => {
            // Make a GET request for each other users ID, and add their firstname,
            // lastname, and id into each entry of the response.
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
export const focusChat = ({ otherUserId, userId, token, otherUserFirstname, privateKey }) => {
  // Extract error messages from object.
  const { chatRenderFail } = errorMsgs

  return (dispatch) => {
    // Indicate to the user that the focus chat is being rendered.
    dispatch({ type: RENDER_CHAT })

    // To make an HTTP request, there must be a token
    // in the header.
    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })

    // Empty variable that will be filled with the appropriate
    // data to be send to the client's state.
    let msgs = GLOBAL.EMPTY_STATE

    // Make a GET request to retrieve chat with current user, using the user's ID.
    axiosInstance.get(`https://miningforgoldstein.me/chat/${otherUserId}`)
      .then(result => {
        // If the GET request is successful, extract any data of the user's from
        // local storage.
        GLOBAL.storage.getAllDataForKey(`${otherUserId}:${userId}-messages`)
          .then(res => {
            // If there are any data from local storage, sort out all the messages
            // that are from the client and the user that wants to be talked to
            // and put it in msgs - which is an array.
            let count = 0;
            msgs = result.data.map(msg => {
              if(msg.receiverID === otherUserId) {
                return res[count++]
              } else {
                return decryptor(JSON.parse(msg.message), privateKey)
              }
            })

            // If GET request is successful, find the other user's public
            // key in local storage.
            GLOBAL.storage.load({ key: `${otherUserId}:${userId}-${GLOBAL.PUBLIC_KEY_STRING}` })
              .then(({ publicKey }) => {
                // Indicate to the user that chat render is done.
                dispatch({ type: RENDER_CHAT_DONE })

                // If public key is in local storage, then dispatch
                // a response to change states appropriately.
                dispatch({
                  type: RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
                  payload: {
                    messages: msgs,
                    publicKey,
                    otherUserId,
                    otherUserFirstname
                  }
                })

                Actions.focusChat({title: otherUserFirstname})
              })
              .catch((err) => {
                // Indicate to the user that chat render is done.
                dispatch({ type: RENDER_CHAT_DONE })

                // If public key is not in local storage, then dispatch
                // a response to change states appropriately, but without
                // the public key.
                dispatch({
                  type: RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
                  payload: {
                    messages: msgs,
                    otherUserId,
                    otherUserFirstname
                  }
                })

                Actions.focusChat({title: otherUserFirstname})
              })
          })
          .catch(() => {
            // If there are no data from local storage, simply return
            // all the messages from the GET request.
            msgs = result.data.map(msg => {
              return decryptor(JSON.parse(msg.message), privateKey)
            })

            // If GET request is successful, find the other user's public
            // key in local storage.
            GLOBAL.storage.load({ key: `${otherUserId}:${userId}-${GLOBAL.PUBLIC_KEY_STRING}` })
              .then(({ publicKey }) => {
                // Indicate to the user that chat render is done.
                dispatch({ type: RENDER_CHAT_DONE })

                // If public key is in local storage, then dispatch
                // a response to change states appropriately.
                dispatch({
                  type: RENDER_CHAT_SUCCESS_WITH_PUBLIC_KEY,
                  payload: {
                    messages: msgs,
                    publicKey,
                    otherUserId,
                    otherUserFirstname
                  }
                })

                Actions.focusChat({title: otherUserFirstname})
              })
              .catch((err) => {
                // Indicate to the user that chat render is done.
                dispatch({ type: RENDER_CHAT_DONE })

                // If public key is not in local storage, then dispatch
                // a response to change states appropriately, but without
                // the public key.
                dispatch({
                  type: RENDER_CHAT_SUCCESS_WITH_NO_PUBLIC_KEY,
                  payload: {
                    messages: msgs,
                    otherUserId,
                    otherUserFirstname
                  }
                })

                Actions.focusChat({title: otherUserFirstname})
              })
          })   
      })
      .catch((err) => {
        // If GET request to retrieve current chat is unsuccessful,
        // dispatch the appropriate error response.
        dispatch({
          type: RENDER_CHAT_FAIL,
          payload: chatRenderFail
        })

        Actions.focusChat({title: otherUserFirstname})
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
export const sendMessage = ({ input, otherUserId, userId, token, publicKey, privateKey, messages }) => {
  // Extract error messages from object.
  const { emptyKeys, messageSendError, chatRenderFail, emptyInput } = errorMsgs

  return ((dispatch) => {
    if(publicKey === GLOBAL.EMPTY_STATE) {
      // Dispatch an client error response
      // if there is no public key.
      dispatch({
        type: MESSAGE_SENT_FAIL,
        payload: emptyKeys
      })
    } else if (input === '' ) {
      // Dispatch a failed message if there is no
      // message to be sent.
      dispatch({
        type: MESSAGE_SENT_FAIL,
        payload: emptyInput
      })
    } else {
      // Create a new variable object for the
      // input that the client sent.
      const newMessage = {
        message: input,
        date: Date.now()
      }

      // Append the new message object into the
      // list of messages.
      messages.push(newMessage)

      // Clears out input.
      dispatch({ type: MESSAGE_SENT_SUCCESSFUL })

      // Dispatch the messages and its data source,
      // as the payloads.
      dispatch({
        type: RENDER_CHAT_SUCCESS,
        payload: {
          messages: messages,
          dataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
          }).cloneWithRows(messages)
        }
      })

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
          // If PUT request is successful, save the sent message into local storage.
          GLOBAL.storage.load({ key: `${otherUserId}:${userId}-count` })
            .then(({ count }) => {
              GLOBAL.storage.save({
                key: `${otherUserId}:${userId}-messages`,
                id: count++,
                rawData: { 
                  message: input,
                  date: Date.now()
                },
                expires: null
              })

              GLOBAL.storage.save({
                key: `${otherUserId}:${userId}-count`,
                rawData: { count: count++ }
              })          
            })
            .catch(() => {
              GLOBAL.storage.save({
                key: `${otherUserId}:${userId}-count`,
                rawData: { count: 1002 }
              })

              GLOBAL.storage.save({
                key: `${otherUserId}:${userId}-messages`,
                id: 1001,
                rawData: {
                  message: input,
                  date: Date.now()
                },
                expires: null
              })
            })
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
export const findPublicKey = ({ userId, publicKeyFileName, otherUserId }) => {
  // Extract error messages from object.
  const { emptyKeyInput, keyFindFail } = errorMsgs

  return (dispatch) => {
    // Send an action type of FIND_PUBLIC_KEY to indicate
    // that request is being processed.
    dispatch({ type: FIND_PUBLIC_KEY })

    if (publicKeyFileName === GLOBAL.EMPTY_STATE) {
      // Send the appropriate client error response
      // if user inputs empty.
      findPublicKeyFail(dispatch, emptyKeyInput)
    } else {
      // Read file path that user inputted and check the appropriate folder.
      RNFS.readFile(`${RNFS.ExternalDirectoryPath}/${publicKeyFileName}.txt`)
        .then((publicKey) => {
          // If the file is found, save it in local storage.
          GLOBAL.storage.save({
            key: `${otherUserId}:${userId}-${GLOBAL.PUBLIC_KEY_STRING}`,
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
* Interval function that constantly checks and updates any messages from the
* HTTP request.
* 
* @param {object} = { token:String, otherUserId:String, userId:String, privateKey:String }
*/  
export const checkAndUpdateMessages = ({ token, otherUserId, userId, privateKey }) =>{
  // Extract error messages from object.
  const { chatRenderFail } = errorMsgs
  
  return (dispatch) => {
    // Indicate to the user that chat is being updated.
    dispatch({ type: UPDATE_CHAT })

    // To make an HTTP request, there must be a token
    // in the header.
    const axiosInstance = axios.create({
      headers: {'authorization': token}
    })

    // Empty variable that will be filled with the appropriate
    // data to be send to the client's state.
    let msgs = GLOBAL.EMPTY_STATE

    // Make a GET request to retrieve chat with current user, using the user's ID.
    axiosInstance.get(`https://miningforgoldstein.me/chat/${otherUserId}`)
      .then((result) => {
        // If GET request is successful, grab all data in local storage.
        GLOBAL.storage.getAllDataForKey(`${otherUserId}:${userId}-messages`)
          .then(res => {
            // If there are data in local storage, sort out the client's and
            // the user's messages.
            let count = 0;
            msgs = result.data.map(msg => {
              if(msg.receiverID === otherUserId) {
                return res[count++]
              } else {
                return decryptor(JSON.parse(msg.message), privateKey)
              }
            })

            // Indicate to the client that chat was updated successfully,
            // with the appropriate payload.
            dispatch({
              type: RENDER_CHAT_SUCCESS,
              payload: {
                messages: msgs,
                dataSource: new ListView.DataSource({
                  rowHasChanged: (r1, r2) => r1 !== r2
                }).cloneWithRows(msgs)
              }
            })
          })
          .catch(() => {
            // If there are no data from local storage, simply return
            // data from GET request.
            msgs = result.data.map(msg => {
              return decryptor(JSON.parse(msg.message), privateKey)
            })

            // Indicate to the client that chat was updated successfully,
            // with the appropriate payload.
            dispatch({
              type: RENDER_CHAT_SUCCESS,
              payload: msgs
            })
          })
      })
      .catch(() => {
        // If GET request fails, dispatch a failed message.
        dispatch({
          type: RENDER_CHAT_FAIL,
          payload: chatRenderFail
        })
      })
  }
}

/*
* Sets the Focus Chat Interval ID.
* 
* @param {object} = { focusChatIntervalId:String }
*/  
export const setFocusChatIntervalId = ({ focusChatIntervalId }) => {
  return (dispatch) => {
    dispatch({
      type: SET_FOCUS_CHAT_INTERVAL_ID,
      payload: focusChatIntervalId
    })
  }
}

/*
* Removes the Focus Chat Interval ID.
* 
* @param {object} = { focusChatIntervalId:String }
*/  
export const removeFocusChatIntervalId = ({ focusChatIntervalId }) => {
  return (dispatch) => {
    dispatch({ type: REMOVE_FOCUS_CHAT_INTERVAL_ID })
  }
}

/*
* Sets the Chat List Interval ID.
* 
* @param {object} = { chatListIntervalId:String }
*/ 
export const setChatListIntervalId = ({ chatListIntervalId }) => {
  return (dispatch) => {
    dispatch({
      type: SET_CHAT_LIST_INTERVAL_ID,
      payload: chatListIntervalId
    })
  }
}

/*
* Removes the Chat List Interval ID.
* 
* @param {object} = { chatListIntervalId:String }
*/ 
export const removeChatListIntervalId = ({ chatListIntervalId }) => {
  return (dispatch) => {
    dispatch({ type: REMOVE_CHAT_LIST_INTERVAL_ID })
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
    type: FIND_PUBLIC_KEY_SUCCESS,
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
    type: FIND_PUBLIC_KEY_FAIL,
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
  messageSendError: 'Unable to send message',
  emptyInput: ''
}