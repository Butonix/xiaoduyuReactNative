

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  WebView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'

import { StackNavigator, TabNavigator } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { loadPostsById } from '../../actions/posts'
import { like, unlike } from '../../actions/like'
// import { getPostsById } from '../../reducers/posts'
import { getUserInfo } from '../../reducers/user'


class LikeButton extends Component {

  constructor (props) {
    super(props)
    this.state = {}
    this.like = this.like.bind(this)
  }

  like() {

    const { navigate } = this.props.navigation
    const { me, type, target_id, like, handleLike, handleUnlike } = this.props

    if (!me) return navigate('SignIn')

    let fn = like ? handleUnlike : handleLike

    handleLike({
      data: {
        type: type,
        target_id: target_id,
        mood: 1
      },
      callback: (res)=> {
        if (res && !res.success) {
          Alert.alert('', res.error : '提交失败')
        }
        
        console.log(res);
      }
    })
  }

  render() {

    const { like = false, type, target_id, me } = this.props

    return (
          <TouchableWithoutFeedback onPress={()=>{this.like()}}>
            <View>
              <Text style={styles.like}>{like ? '已赞' : '赞'}</Text>
            </View>
          </TouchableWithoutFeedback>
        )
  }
}


const styles = StyleSheet.create({
  posts: {
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
    // marginTop:100
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  main: {
    flex: 2
  },
  topicItem: {
    backgroundColor: '#fff',
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },
  itemMain: {
    marginTop:10
  },
  bottomBar: {
    // position:'absolute',
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
    // bottom:90,
    // right:20
  },
  comment: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  like: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  follow: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  }
});

export default connect((state, props) => {
    // const id = props.navigation.state.params.id
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch) => ({
    handleLike: bindActionCreators(like, dispatch),
    handleUnlike: bindActionCreators(unlike, dispatch)
  })
)(LikeButton);
