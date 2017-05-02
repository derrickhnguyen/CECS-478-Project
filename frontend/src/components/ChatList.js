import React, { Component } from 'react'
import { Text, TouchableOpacity, ScrollView } from 'react-native'
import TimerMixin from 'react-timer-mixin'
import { connect } from 'react-redux'
import { Card, CardSection, ErrorMessage, Spinner } from './common'
import { renderList, focusChat, setChatListIntervalId, removeChatListIntervalId } from '../actions'
import ChatItem from './ChatItem'

/*
* Component that displays the Chat List Page.
*/
class ChatList extends Component {
  // Declare variables for every function in this class
  // to use.
  constructor(props) {
    super(props)
    this.mixins = [TimerMixin]
  }

  // Before component renders:
  // call the function, ../actions/ChatAction/renderList
  componentWillMount() {
    const { token, userId } = this.props
    this.props.renderList({ token, userId })
  }

  // After component renders:
  // create an interval function call to constantly
  // re-render the list.
  componentDidMount() {
    const { token, userId } = this.props
    let chatListIntervalId = setInterval(() => {
      this.props.renderList({ token, userId })
    }, 6000)

    this.props.setChatListIntervalId({ chatListIntervalId })
  }

  // Whenever the button is pressed, this function will be called.
  // It will change screen to the focus chat and remove the interval
  // that constantly re-renders chat list.
  onButtonPress(otherUserId, otherUserFirstname) {
    const { token, privateKey, userId, chatListIntervalId } = this.props
    this.props.focusChat({ otherUserId, userId, token, otherUserFirstname, privateKey })

    clearInterval(chatListIntervalId)
    this.props.removeChatListIntervalId({ chatListIntervalId })
  }

  // Main function to render Chat List page.
  render() {
    // Extract object within the styles object.
    const { newChatContainerStyle, newChatStyle, chatTitleStyle } = styles

    // Extract states from props object.
    const { loading, listOfChats, chatListError } = this.props

    // If there is an error, display the error.
    if (chatListError) {
      return <ErrorMessage error={chatListError} />
    } else if (loading) {
      // If loading is set to true, display spinner.
      return <Spinner size='large' />
    } else if (listOfChats.length === 0) {
      // If there are no chats, display new chat prompt.
      return (
        <Card style={newChatContainerStyle}>
          <Text style={newChatStyle}>Start a new chat by clicking 'Add'!</Text>
        </Card>
      )
    } else {
      // Render the list.
      const list = listOfChats.map(chat => {
        return (
          <TouchableOpacity
            key={`${chat.firstname} ${chat.lastname}`}
            onPress={this.onButtonPress.bind(this, chat.otherUserId, chat.firstname)}
          >
            <ChatItem firstname={chat.firstname} lastname={chat.lastname} />
          </TouchableOpacity>
        )
      })

      return (
        <Card style={{flex: 1}}>
          <Text style={chatTitleStyle}>Here are your current chats</Text>
          <ScrollView>
            {list}
          </ScrollView>
        </Card>
      )
    }
  }
}

// Styles property.
const styles = {
  newChatContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newChatStyle: {
    color: 'darkgrey',
    fontSize: 20
  },
  chatTitleStyle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold'
  }
}

// Extract states from auth and chatList reducer,
// and use it for this page.
const mapStateToProps = ({ auth, chatList }) => {
  const { token, userId, privateKey } = auth
  const { listOfChats, loading, chatListError, chatListIntervalId } = chatList
  return { token, listOfChats, userId, privateKey, loading, chatListIntervalId }
}

// Connects this page with redux so states can be
// used from auth and chatList.
//
// Exports ChatList.js to be used for application.
export default connect(mapStateToProps, {
  renderList,
  focusChat,
  setChatListIntervalId,
  removeChatListIntervalId
})(ChatList)