

import React, { Component } from 'react'
import { View, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, AsyncStorage } from 'react-native'
// import ScrollableTabView from 'react-native-scrollable-tab-view'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'
import { cleanAllComment } from '../../actions/comment'

import PostsList from '../../components/posts-list'
// import TabBar from '../../components/tab-bar'
// import MenuIcon from '../../components/ui/icon/menu'

import JPushModule from 'jpush-react-native'
import Platform from 'Platform'

class Home extends Component {

  static navigationOptions = {
    header: null,
    title: '发现',
    // tabBarIcon: ({ tintColor }) => (<Image source={require('./images/home.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />)
  }

  constructor (props) {
    super(props)

    this.state = {
      listener: null
    }
  }

  componentDidMount() {

    const { me, cleanAllComment } = this.props
    const { navigate } = this.props.navigation

    this.state.listener = (result) => {
      if (result.routeName && result.params) {
        cleanAllComment()
        JPushModule.setBadge(0, ()=>{})
        navigate(result.routeName, result.params)
      }
    }

    /*
    if (Platform.OS === 'android') {
      JPushModule.initPush();
    }

      JPushModule.addReceiveOpenNotificationListener(this.state.listener)

      // 设置别名, 发送给指定的用户
      AsyncStorage.getItem('jpush_alias', (errs, result)=>{
        if (!result) {
          AsyncStorage.setItem('jpush_alias', me._id, function(errs, result){
            JPushModule.setAlias(me._id, (res)=>{
            }, (res)=>{
            })
          })
        }
      })

      // 设置标签，推送已登陆的用户
      AsyncStorage.getItem('jpush_tag', (errs, result)=>{
        if (!result) {
          let tag = 'signin'
          AsyncStorage.setItem('jpush_tag', tag, function(errs, result){
            JPushModule.setTags(tag.split(','), ()=>{}, ()=>{})
          })
        }
      })

    */

    if (me.phone) return

    AsyncStorage.getItem('binding-phone-tips', (errs, result)=>{
      result = null
      if (result && new Date().getTime() > parseInt(result)) {

        Alert.alert('绑定手机号', '亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。', [
          {
            text: '暂不',
            onPress: () => {
              AsyncStorage.setItem('binding-phone-tips', (new Date().getTime() + 1000 * 60 * 60 * 24 * 3) + '', ()=>{})
            }
          },
            {
              text: '去绑定',
              onPress: () => navigate('BindingPhone')
            }
          ]
        )
      } else if (!result) {
        AsyncStorage.setItem('binding-phone-tips', (new Date().getTime() + 1000 * 60 * 60 * 24 * 3) + '', ()=>{})
      }

    })

  }

  componentWillUnmount() {

    if (this.state.listener) {
      // 移除监听事件
      // JPushModule.removeReceiveOpenNotificationListener(this.state.listener)
      this.state.listener = null
    }
  }

  render() {

    const { navigation } = this.props

    return (<PostsList
              {...this.props}
              tabLabel='发现'
              navigation={navigation}
              name="discover"
              filters={{
                weaken: 1
                // include_comments: 1,
                // comments_sort: 'like_count:-1,reply_count:-1'
              }}
            />)
  }
}

// const stylesIcon = StyleSheet.create({
//   icon: { width: 24, height: 24 }
// })

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    cleanAllComment: bindActionCreators(cleanAllComment, dispatch)
  })
)(Home)
