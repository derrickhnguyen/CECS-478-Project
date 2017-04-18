import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardSection } from './common'
import { renderList } from '../actions'
import ChatItem from './ChatItem'

class ChatList extends Component {
  componentWillMount() {
    const { token, userId } = this.props
    this.props.renderList({ token, userId })
  }

  render() {
    const list = this.props.listOfChats.map(chat => {
      console.log(chat)
      return (
        <ChatItem firstname={this.props.chat.firstname} lastname={this.props.chat.lastname} />
      )
    })

    return (
      <Card>
        {list}
      </Card>
    )
  }
}

const mapStateToProps = ({ auth, chatList }) => {
  const { token, userId } = auth
  const { listOfChats, loading } = chatList
  return { token, listOfChats, userId, loading }
}

export default connect(mapStateToProps, {renderList})(ChatList)