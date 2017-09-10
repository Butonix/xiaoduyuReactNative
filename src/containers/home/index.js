

import React, { PureComponent } from 'react'
import { View, ScrollView, Image, StyleSheet } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import PostsList from '../../components/posts-list'
import TabBar from '../../components/tab-bar'

class Home extends PureComponent {

  static navigationOptions = {
    header: null,
    title: '首页',
    tabBarIcon: ({ tintColor }) => (<Image source={require('./images/home.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />),
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
      initialPage={0}
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
            // include_comments: -1,
            // comments_sort: 'create_at:1'
          }}
          />

      </ScrollableTabView>)
  }
}

const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 }
})

export default Home
