

import React, { Component } from 'react'
import { View, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, AsyncStorage } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'

import PostsList from '../../components/posts-list'
import TabBar from '../../components/tab-bar'
import MenuIcon from '../../components/ui/icon/menu'

import JPushModule from 'jpush-react-native'

class Home extends Component {

  static navigationOptions = {
    header: null,
    title: '首页',
    tabBarIcon: ({ tintColor }) => (<Image source={require('./images/home.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />)
  }

  componentDidMount() {
    const { me } = this.props
    const { navigate } = this.props.navigation
    JPushModule.addReceiveOpenNotificationListener((result) => {
      if (result.routeName && result.params) {
        navigate(result.routeName, result.params)
      }
    })
    
    AsyncStorage.getItem('jpush_alias', (errs, result)=>{
      if (!result) {
        AsyncStorage.setItem('jpush_alias', me._id, function(errs, result){
          JPushModule.setAlias(me._id, ()=>{}, ()=>{})
        })
      }
    })

  }

  render() {

    const { navigation } = this.props

    return (<ScrollableTabView
      style={{ backgroundColor:'#ededee', padding:0, margin:0 }}
      tabBarBackgroundColor = "#fff"
      tabBarActiveTextColor = "#20adda"
      tabBarInactiveTextColor = "#484848"
      tabBarUnderlineStyle={{
        borderColor: '#20adda'
      }}
      initialPage={1}
      renderTabBar={(res)=><TabBar navigation={navigation} />}
      >

        <PostsList
          {...this.props}
          tabLabel='关注'
          navigation={navigation}
          name="follow"
          filters={{
            weaken: 1,
            method: 'user_custom',
            include_comments: 1,
            comments_sort: 'create_at:-1'
          }}
          />

        <PostsList
          {...this.props}
          tabLabel='发现'
          navigation={navigation}
          name="discover"
          filters={{
            weaken: 1,
            // method: 'user_custom'
            include_comments: 1,
            comments_sort: 'create_at:-1'
          }}
          />

      </ScrollableTabView>)
  }
}

const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 }
})

// export default Home

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
  })
)(Home)
