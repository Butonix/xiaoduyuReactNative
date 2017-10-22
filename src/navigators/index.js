
import { StackNavigator, TabNavigator } from 'react-navigation'

import Welcome from '../containers/welcome'
import FastSignIn from '../containers/fast-sign-in'
import SignIn from '../containers/sign-in'
import SignUp from '../containers/sign-up'
import GithubSignIn from '../containers/github-sign-in'
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

// setting
import ResetNickname from '../containers/reset-nickname'
import ResetBiref from '../containers/reset-brief'
import ResetGender from '../containers/reset-gender'
import ResetPassword from '../containers/reset-password'
import ResetEmail from '../containers/reset-email'
import ResetAvatar from '../containers/reset-avatar'


// test
// import Test from '../containers/test'
// import Editor from '../containers/editor'

const MainScreenNavigator = TabNavigator({
  Home: { screen: Home },
  MineFollow: { screen: MineFollow },
  Notifications: { screen: Notifications },
  Me: { screen: Me }
},
{
  initialRouteName: 'Home',
  tabBarPosition: 'top',
  swipeEnabled:true,
  animationEnabled:true,
  lazy: true,
  tabBarOptions: {
    style: { height:65 },
    activeBackgroundColor:'white',
    activeTintColor:'#08f',
    inactiveBackgroundColor:'white',
    inactiveTintColor:'#23232b',
    allowFontScaling: false,
    labelStyle: {
      fontSize: 14,
      paddingBottom:15,
      zIndex:-1,
      borderBottomWidth:1,
      borderColor: 'red'
    },
    tabStyle:{
      borderBottomWidth:1,
      borderColor: '#e3e3e3'
    }
    // showLabel:false,
  }
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
  GithubSignIn: { screen: GithubSignIn },
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
  FastSignIn: { screen: FastSignIn }
  // Test: { screen: Test }
},{
  initialRouteName: 'Welcome',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#191919'
  }
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
