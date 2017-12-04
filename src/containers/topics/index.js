import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  NavigatorIOS,
  ScrollView,
  refreshControl,
  RefreshControl,
  Navigator,
  Button
} from 'react-native';
import TopicList from '../../components/topic-list'
import PostsList from '../../components/posts-list'

class Topic extends React.Component {

  static navigationOptions = {
    // header: null,
    title: '话题',
    // tabBarLabel: (props) => {
    //   return (<View style={stylesIcon.tabBarLabel}>
    //     <View style={stylesIcon.tabBarLabelView}><Text>话题</Text></View>
    //     <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
    //     </View>)
    // }
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('./images/topic.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />
    )
  }

  render() {

    const { navigation } = this.props

    // return <PostsList
    //           {...this.props}
    //           tabLabel='话题'
    //           navigation={navigation}
    //           name="follow"
    //           filters={{
    //             weaken: 1,
    //             method: 'user_custom',
    //             include_comments: 1,
    //             comments_sort: 'create_at:-1',
    //             device: 'ios'
    //           }}
    //           />

    return <TopicList name="topic" filters={{ child:1, per_page:10 }} {...this.props} />
  }
}

const stylesIcon = StyleSheet.create({
  icon: { width: 26, height: 26, marginTop:-5 },
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

export default Topic
