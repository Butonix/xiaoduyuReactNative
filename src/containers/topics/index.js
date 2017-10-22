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
    header: null,
    title: '话题',
    // tabBarIcon: ({ tintColor }) => (
    //   <Image source={require('./images/topic.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />
    // )
  }

  render() {

    const { navigation } = this.props

    return <PostsList
              {...this.props}
              tabLabel='话题'
              navigation={navigation}
              name="follow"
              filters={{
                weaken: 1,
                method: 'user_custom',
                include_comments: 1,
                comments_sort: 'create_at:-1',
                device: 'ios'
              }}
              />

    // return <TopicList name="topic" filters={{ child:1 }} {...this.props} />
  }
}

const stylesIcon = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default Topic
