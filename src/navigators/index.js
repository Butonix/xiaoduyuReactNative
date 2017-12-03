import Platform from 'Platform'

import { StackNavigator, TabNavigator } from 'react-navigation'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Welcome from '../containers/welcome'
import FastSignIn from '../containers/fast-sign-in'
import SignIn from '../containers/sign-in'
import SignUp from '../containers/sign-up'
import OtherSignIn from '../containers/other-sign-in'
import Forgot from '../containers/forgot'
import Home from '../containers/home'
import MineFollow from '../containers/mine-follow'
import PostsDetail from '../containers/posts-detail'
import Topics from '../containers/topics'
import Notifications from '../containers/notifications'
import Me from '../containers/me'
import CommentDetail from '../containers/comment-detail'
import WriteComment from '../containers/write-comment'
import WritePosts from '../containers/write-posts'
import ChooseTopic from '../containers/choose-topic'
import Settings from '../containers/settings'
import TopicDetail from '../containers/topic-detail'
import PeopleDetail from '../containers/people-detail'
import List from '../containers/list'
import SocialAccount from '../containers/social-account'
import Agreement from '../containers/agreement'

// setting
import ResetNickname from '../containers/reset-nickname'
import ResetBiref from '../containers/reset-brief'
import ResetGender from '../containers/reset-gender'
import ResetPassword from '../containers/reset-password'
import ResetEmail from '../containers/reset-email'
import ResetAvatar from '../containers/reset-avatar'
import ResetPhone from '../containers/reset-phone'
import BindingPhone from '../containers/binding-phone'

import Report from '../containers/report'
import Block from '../containers/block'

// test
// import Test from '../containers/test'
// import Editor from '../containers/editor'

let tabBarOptions = {
  style: {
    ...ifIphoneX({
        height: 75,
        backgroundColor:'#fff',
        // borderBottomWidth:1,
        // borderColor: '#e3e3e3'
    }, {
        // height: 65,
        backgroundColor:'#fff',
        // borderTopWidth:3,
        // borderColor: 'red'
    })
  },
  // activeBackgroundColor:'#fff',
  activeTintColor:'#08f',
  // inactiveBackgroundColor:'#fff',
  inactiveTintColor:'#484848',
  // allowFontScaling: false,

  // indicatorStyle:{ top:0 },

  // activeTabStyle: {
  //   backgroundColor: 'red'
  // },

  // 文本
  // labelStyle: {
    // color: 'rgb(115, 115, 115)'
    // fontSize: 10
    // marginBottom:15,
    // fontWeight: "bold"
  // },
  // indicatorStyle: {
  //   borderBottomWidth:10,
  //   borderColor: 'red',
  //   top:0
  // },
  // showIcon: true
  // showLabel: false
}

if (Platform.OS === 'android') {
  tabBarOptions = {
    style: {
      height: 60,
      backgroundColor:'#fff'
    },
    activeBackgroundColor:'#fff',
    activeTintColor:'#08f',
    inactiveBackgroundColor:'#fff',
    inactiveTintColor:'#484848',
    allowFontScaling: false,
    labelStyle: {
      marginTop:15
    },
    tabStyle:{
      // borderBottomWidth:1,
      // borderColor: '#e3e3e3'
    },

    // android
    showIcon: false,
    // showLabel: false,
    // iconStyle: { width:24, height:24 },
    // labelStyle:{ fontSize: 8, marginTop:0 },
    indicatorStyle: { backgroundColor: '#08f' }
    // showLabel:false,
  }
}

const MainScreenNavigator = TabNavigator({
  Home: { screen: Home },
  // ChooseTopic: { screen: ChooseTopic },
  Topics: { screen: Topics },
  Notifications: { screen: Notifications },
  Me: { screen: Me }
},
{
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled:false,
  animationEnabled:false,
  lazy: true,
  tabBarOptions: tabBarOptions
})

const App = StackNavigator({
  Main: { screen: MainScreenNavigator },
  PostsDetail: { screen: PostsDetail },
  WriteComment: { screen: WriteComment },
  WritePosts: { screen: WritePosts },
  ChooseTopic: { screen: ChooseTopic },
  CommentDetail: { screen: CommentDetail },
  Welcome: { screen: Welcome },
  SignIn: { screen: SignIn },
  Settings: { screen: Settings },
  SignUp: { screen: SignUp },
  Forgot: { screen: Forgot },
  OtherSignIn: { screen: OtherSignIn },
  TopicDetail: { screen: TopicDetail },
  PeopleDetail: { screen: PeopleDetail },
  List: { screen: List },
  ResetNickname: { screen: ResetNickname },
  ResetBiref: { screen: ResetBiref },
  ResetGender: { screen: ResetGender },
  ResetPassword: { screen: ResetPassword },
  ResetEmail: { screen: ResetEmail },
  ResetAvatar: { screen: ResetAvatar },
  SocialAccount: { screen: SocialAccount },
  FastSignIn: { screen: FastSignIn },
  ResetPhone: { screen: ResetPhone },
  BindingPhone: { screen: BindingPhone },
  Agreement: { screen: Agreement },
  Report: { screen: Report },
  Block: { screen: Block }
  // Test: { screen: Test }
},{
  initialRouteName: 'Welcome',
  // cardStyle: {},
  navigationOptions: {
    headerTruncatedBackTitle: '返回',
    headerBackTitle: null,
    headerStyle: {
      backgroundColor: '#fff',
      ...ifIphoneX({
          paddingTop:30,
          height: 75,
          borderBottomWidth:1,
          borderColor: '#efefef'
      }, {
          height: 65
      })
    },
    headerTintColor: '#484848',
    headerTitleStyle: {
      fontSize: 15,
      color:'#484848'
    },
    headerBackTitleStyle: {
      backgroundColor: '#333'
    },
    headerBackTitleStyle: {
      fontSize:15
    }
  },
  headerMode: 'screen'
})

/*
const defaultGetStateForAction = App.router.getStateForAction;

App.router.getStateForAction = (action, state) => {


  console.log('进入了-------------------');
  console.log(action.routeName);

  if (action && action.routeName) {

    console.log(action);


    if (global.visitedRouter.indexOf(action.routeName) == -1) {
      global.visitedRouter.push(action.routeName)
    }

    console.log(global.visitedRouter);

  }




  // console.log(state);

  if (!global.signIn) {

    // console.log(action.routeName);

    if (action.routeName == 'WriteComment' ||
      action.routeName == 'Notifications' ||
      action.routeName == 'Me'
      ) {

      const routeName = state ? state.routes[0].routeName : action.routeName

      // console.log(routeName);
      // , params: { backRouteName: routeName  }
      const routes = [
        ...state.routes,
        { key: 'SignIn', routeName: 'SignIn' }
      ]

      return {
        ...state,
        routes,
        index: routes.length - 1
      }
    }

  }



  return defaultGetStateForAction(action, state);
};
*/

export default App
