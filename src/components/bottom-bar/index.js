
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getUserInfo } from '../../reducers/user'
import LikeButton from '../../components/like-button'
import FollowButton from '../../components/follow-button'

class BottomBar extends Component {

  constructor (props) {
    super(props)
  }

  goWriteComment() {

    const { navigate } = this.props.navigation
    const { me, posts, comment } = this.props

    let data = {}

    if (posts) {
      data.postsId = posts._id
    }

    if (comment) {
      data.postsId = comment.posts_id._id
      data.parentId = comment.parent_id ? comment.parent_id : comment._id
      data.replyId = comment._id
    }

    navigate('WriteComment', data)
  }

  render() {

    const { posts, comment } = this.props

    if (!posts && !comment) {
      return (<View></View>)
    }
    
    return (
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={this.goWriteComment.bind(this)}>
            <View><Text style={styles.comment}>评论</Text></View>
          </TouchableOpacity>
          <LikeButton likeType={posts ? 'posts' : 'comment'} target_id={posts ? posts._id : comment._id} {...posts} {...comment} />
          {posts ? <FollowButton posts_id={posts._id} {...posts} /> : null}
        </View>
      )
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  comment: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  }
})

export default connect((state, props) => {
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch) => ({
  })
)(BottomBar)
