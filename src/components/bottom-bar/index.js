
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

    let target = posts || comment

    return (
        <View style={styles.bottomBar}>

          {target.reply ?
            <TouchableOpacity onPress={this.goWriteComment.bind(this)} style={styles.item}>
              <Text style={styles.comment}>回复{target.reply_count || ''}</Text>
            </TouchableOpacity>
            : null}

          {target.comment ?
            <TouchableOpacity onPress={this.goWriteComment.bind(this)} style={styles.item}>
              <Text style={styles.comment}>评论{target.comment_count || ''}</Text>
            </TouchableOpacity>
            : null}
            
          <LikeButton likeType={posts ? 'posts' : 'comment'} target_id={target._id} {...target} />
          {posts ? <View style={styles.item}><FollowButton posts_id={posts._id} {...target} /></View> : null}
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
  },
  item: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
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
