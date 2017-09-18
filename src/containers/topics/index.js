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

class Topic extends React.Component {
  
  static navigationOptions = {
    title: '话题',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./images/topic.png')}
        style={[stylesIcon.icon, {tintColor: tintColor}]}
      />
    ),
    headerStyle: {
      backgroundColor: '#ffffff',
    },
    headerTintColor: '#191919'
  }

  render() {
    return <TopicList name="topic" filters={{ child:1 }} {...this.props} />
  }
}

const stylesIcon = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default Topic
