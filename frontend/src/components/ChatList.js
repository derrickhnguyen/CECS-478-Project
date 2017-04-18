import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardSection, ErrorMessage } from './common'
import { renderList } from '../actions'
import ChatItem from './ChatItem'

class ChatList extends Component {
  componentWillMount() {
    const { token, userId } = this.props
    this.props.renderList({ token, userId })
  }

  render() {
    const { loading, listOfChats, error } = this.props

    if (error !== '') {
      return <ErrorMessage error={error} />
    } else if (loading) {
      return <Spinner size='large' />
    } else if (listOfchats.length === 0) {
      return <Text style={{fontSize: 20}}>Start a new chat by clicking 'Add'!</Text>
    } else {
      const list = listOfChats.map(chat => {
        return (
          <ChatItem firstname={chat.firstname} lastname={chat.lastname} />
        )
      })

      return (
        <Card>
          {list}
        </Card>
      )
    }
  }
}

const mapStateToProps = ({ auth, chatList }) => {
  const { token, userId } = auth
  const { listOfChats, loading, error } = chatList
  return { token, listOfChats, userId, loading }
}

export default connect(mapStateToProps, { renderList })(ChatList)