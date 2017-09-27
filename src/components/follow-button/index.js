
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, unfollow } from '../../actions/follow'
// import { getUserInfo } from '../../reducers/user'

const S = global.styles

class FollowButton extends Component {

  constructor (props) {
    super(props)
  }

  follow() {
    const { topic_id, posts_id, people_id, follow, handleFollow, handleUnfollow } = this.props
    let fn = follow ? handleUnfollow : handleFollow

    let data = {}

    if (posts_id) {
      data.posts_id = posts_id
    } else if (people_id) {
      data.people_id = people_id
    } else if (topic_id) {
      data.topic_id = topic_id
    }

    fn({
      data,
      callback: (res)=> {
        if (res && !res.success) {
          Alert.alert('', res.error : '提交失败')
        }
      }
    })
  }

  render() {
    const { follow = false, follow_count, posts_id } = this.props
    return (<TouchableOpacity onPress={this.follow.bind(this)} style={styles.item}>
              <Image source={require('../comment-item/images/follow.png')} style={[{width:24,height:24}]} resizeMode="cover" />
              <Text style={S['f-s-10']}>{follow ? '已关注' : '关注'}{posts_id ? '帖子' : null}{follow_count || null}</Text>
          </TouchableOpacity>)
  }
}


const styles = StyleSheet.create({
  item: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect((state, props) => {
    return {
      // me: getUserInfo(state)
    }
  },
  (dispatch) => ({
    handleFollow: bindActionCreators(follow, dispatch),
    handleUnfollow: bindActionCreators(unfollow, dispatch)
  })
)(FollowButton)
