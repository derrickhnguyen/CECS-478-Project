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
    if (this.props.loading) {
      return <Spinner size='large' />
    } else {
      const list = this.props.listOfChats.map(({ firstname, lastname }) => {
        return (
          <ChatItem firstname={firstname} lastname={lastname} />
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
  const { listOfChats, loading } = chatList
  return { token, listOfChats, userId, loading }
}

export default connect(mapStateToProps, { renderList })(ChatList)