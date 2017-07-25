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
    )
  }

  render() {
    const { navigation } = this.props
    return <TopicList navigation={navigation} />
  }
}

const stylesIcon = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default Topic
