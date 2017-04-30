import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, ErrorMessage, Spinner } from './common'
import { renderList, focusChat } from '../actions'
import ChatItem from './ChatItem'

class ChatList extends Component {
  componentWillMount() {
    const { token, userId } = this.props
    this.props.renderList({ token, userId })
  }

  onButtonPress(otherUserId, otherUserFirstname) {
    const { token, privateKey } = this.props
    this.props.focusChat({ otherUserId, token, otherUserFirstname, privateKey })
  }

  render() {
    const { newChatContainerStyle, newChatStyle, chatTitleStyle } = styles
    const { loading, listOfChats, chatListError } = this.props

    if (chatListError) {
      return <ErrorMessage error={chatListError} />
    } else if (loading) {
      return <Spinner size='large' />
    } else if (listOfChats.length === 0) {
      return (
        <Card style={newChatContainerStyle}>
          <Text style={newChatStyle}>Start a new chat by clicking 'Add'!</Text>
        </Card>
      )
    } else {
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
        <Card>
          <Text style={chatTitleStyle}>Here are your current chats</Text>
          {list}
        </Card>
      )
    }
  }
}

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

const mapStateToProps = ({ auth, chatList }) => {
  const { token, userId, privateKey } = auth
  const { listOfChats, loading, chatListError } = chatList
  return { token, listOfChats, userId, privateKey, loading }
}

export default connect(mapStateToProps, { renderList, focusChat })(ChatList)