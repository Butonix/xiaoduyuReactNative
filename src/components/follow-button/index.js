
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, unfollow } from '../../actions/follow'
import { getUserInfo } from '../../reducers/user'

class FollowButton extends Component {

  constructor (props) {
    super(props)
  }

  follow() {
    const { me, followType, posts_id, people_id, follow, handleFollow, handleUnfollow } = this.props
    let fn = follow ? handleUnfollow : handleFollow

    let data = {}

    if (posts_id) {
      data.posts_id = posts_id
    } else if (people_id) {
      data.people_id = people_id
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
    const { follow = false, me, user_id, follow_count } = this.props

    // if (user_id && user_id._id && me._id == user_id._id) {
    //   return (<View></View>)
    // }

    return (<TouchableOpacity onPress={this.follow.bind(this)}>
            <View>
              <Text>{follow ? '已关注' : '关注'} {follow_count}</Text>
            </View>
          </TouchableOpacity>)
  }
}


const styles = StyleSheet.create({
})

export default connect((state, props) => {
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch) => ({
    handleFollow: bindActionCreators(follow, dispatch),
    handleUnfollow: bindActionCreators(unfollow, dispatch)
  })
)(FollowButton)
