import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, ErrorMessage, Spinner } from './common'
import { renderList } from '../actions'
import ChatItem from './ChatItem'

class ChatList extends Component {
  componentWillMount() {
    const { token, userId } = this.props
    this.props.renderList({ token, userId })
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
        return <ChatItem key={chat.firstname} firstname={chat.firstname} lastname={chat.lastname} />
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
  const { token, userId } = auth
  const { listOfChats, loading, chatListError } = chatList
  return { token, listOfChats, userId, loading }
}

export default connect(mapStateToProps, { renderList })(ChatList)