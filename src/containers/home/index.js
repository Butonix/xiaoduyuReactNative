

import React, { Component } from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, AsyncStorage } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'
import { cleanAllComment } from '../../actions/comment'

import PostsList from '../../components/posts-list'
import TabBar from '../../components/tab-bar'
// import MenuIcon from '../../components/ui/icon/menu'

import TabBarLabel from '../../components/ui/tab-bar-label'

import JPushModule from 'jpush-react-native'
import Platform from 'Platform'

class Home extends Component {

  static navigationOptions = {
    header: null,
    title: '发现',
    // tabBarLabel: (props) => {
    //   return (<View style={stylesIcon.tabBarLabel}>
    //     <View style={stylesIcon.tabBarLabelView}><Text>发现</Text></View>
    //     <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
    //     </View>)
    // }
    //
    tabBarIcon: ({ tintColor }) => (<Image source={require('./images/home.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />)
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

      if (Platform.OS === 'android') {
        result = JSON.parse(result.extras)
      }

      if (result.routeName && result.params) {
        cleanAllComment()

        if (Platform.OS === 'android') {
        } else {
          JPushModule.setBadge(0, ()=>{})
        }

        navigate(result.routeName, result.params)
      }
    }

    if (Platform.OS === 'android') {
      JPushModule.initPush()

      // JPushModule.notifyJSDidLoad((resultCode)=>{
      //   console.log(resultCode);
      // });

      // JPushModule.resumePush()
    }

    JPushModule.addReceiveOpenNotificationListener(this.state.listener)

    // 设置别名, 发送给指定的用户
    AsyncStorage.getItem('jpush_alias', (errs, result)=>{

      if (!result) {
        AsyncStorage.setItem('jpush_alias', me._id, function(errs, result){
          JPushModule.setAlias(me._id, (res)=>{}, (res)=>{
          })
        })
      }
    })

    // 设置标签，推送已登陆的用户
    AsyncStorage.getItem('jpush_tag', (errs, result)=>{

      if (!result) {
        let tag = 'signin'
        AsyncStorage.setItem('jpush_tag', tag, function(errs, result){
          JPushModule.setTags(tag.split(','), (res)=>{}, (res)=>{
          })
        })
      }
    })

    if (me.phone) return

    // 提示绑定手机
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

    return (<ScrollableTabView renderTabBar={() => <TabBar navigation={navigation} />}>
      <PostsList
                {...this.props}
                tabLabel='发现'
                navigation={navigation}
                name="discover"
                filters={{
                  weaken: 1
                  // include_comments: 1,
                  // comments_sort: 'like_count:-1,reply_count:-1'
                }}
              />

              <PostsList
                {...this.props}
                tabLabel='关注'
                navigation={navigation}
                name="follow"
                filters={{
                  weaken: 1,
                  method: 'user_custom',
                  // include_comments: 1,
                  // comments_sort: 'like_count:-1,reply_count:-1',
                  device: 'ios'
                }}
                      />
    </ScrollableTabView>)

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

const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 },
  tabBarLabel: {
    marginTop:20,
    flex:1,
    width:'100%',
    // height:45,
    // flexDirection: 'row'
  },
  tabBarLabelView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelLine: {
    height:3,
    backgroundColor:'#fff'
  },
  focused: {
    backgroundColor:'#08f'
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    cleanAllComment: bindActionCreators(cleanAllComment, dispatch)
  })
)(Home)
