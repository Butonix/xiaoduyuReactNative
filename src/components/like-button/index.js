
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { like, unlike } from '../../actions/like'
import { getUserInfo } from '../../reducers/user'

class LikeButton extends Component {

  constructor (props) {
    super(props)
  }

  like() {
    const { me, likeType, target_id, like, handleLike, handleUnlike } = this.props
    let fn = like ? handleUnlike : handleLike

    fn({
      data: {
        type: likeType,
        target_id: target_id,
        mood: 1
      },
      callback: (res)=> {
        if (res && !res.success) {
          Alert.alert('', res.error : '提交失败')
        }
      }
    })
  }

  render() {

    const { like = false, me, user_id, like_count } = this.props

    // if (user_id && user_id._id && me._id == user_id._id) {
    //   return null
    // }

    return (
          <TouchableOpacity onPress={this.like.bind(this)} style={styles.item}>
            <Text>{like ? '已赞' : '赞'} {like_count}</Text>
          </TouchableOpacity>
        )
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
      me: getUserInfo(state)
    }
  },
  (dispatch) => ({
    handleLike: bindActionCreators(like, dispatch),
    handleUnlike: bindActionCreators(unlike, dispatch)
  })
)(LikeButton)
