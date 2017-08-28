import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  WebView
} from 'react-native'
import {
  createNavigator,
  createNavigationContainer,
  TabRouter,
  addNavigationHelpers,
} from 'react-navigation';

import Home from '../home'
import Topics from '../topics'

const HistoryTabRouter = TabRouter(
 {
   RecentSearches: {
     screen: Home,
     path: '',
   },
   RecentStories: {
     screen: Topics,
     path: 'RecentStories',
   }
 },
 {
   initialRouteName: 'RecentSearches',
   swipeEnabled:true,
   animationEnabled:false,
   lazy: true
 }
)

class HistoryTabBar extends Component {
  constructor(props) {
      super(props)
      const { routes } = this.props.navigation.state
      const navigation = this.props.navigation
  }
  render () {
      return (
          <View>
            {this.props.navigation.state.routes.map(route => (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(route.routeName)}
                key={route.routeName}
              >
                <Text>{route.routeName}</Text>
              </TouchableOpacity>
            ))}
          </View>
      );
  }
}

const HistoryTabView = ({ router, navigation }) => {
const { routes, index } = navigation.state;
const ActiveScreen = router.getComponentForState(navigation.state);
return (
  <View >
    <HistoryTabBar navigation={navigation} />
    <ActiveScreen
      navigation={addNavigationHelpers({
        ...navigation,
        state: routes[index],
      })}
    />
  </View>
);
};


const CustomTabs = createNavigationContainer(
 createNavigator(HistoryTabRouter)(HistoryTabView)
);

export default CustomTabs
