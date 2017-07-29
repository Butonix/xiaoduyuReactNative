
import { StackNavigator, TabNavigator } from 'react-navigation'

import SignIn from '../containers/sign-in'
import SignUp from '../containers/sign-up'
import GithubSignIn from '../containers/github-sign-in'
import Forgot from '../containers/forgot'
import Home from '../containers/home'
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

const MainScreenNavigator = TabNavigator({
  Home: { screen: Home },
  Topics: { screen: Topics },
  Notifications: { screen: Notifications },
  Me: { screen: Me }
},
{
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled:false,
  animationEnabled:false,
  tabBarOptions: {
    style: { height:45 },
    activeBackgroundColor:'#fff',
    activeTintColor:'#27a8fb',
    inactiveBackgroundColor:'white',
    inactiveTintColor:'#484848',
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
  SignIn: { screen: SignIn },
  Settings: { screen: Settings },
  SignUp: { screen: SignUp },
  Forgot: { screen: Forgot },
  GithubSignIn: { screen: GithubSignIn },
  TopicDetail: { screen: TopicDetail }
},{
  initialRouteName: 'SignIn'
})

/*
const defaultGetStateForAction = App.router.getStateForAction;

App.router.getStateForAction = (action, state) => {

  console.log('进入了-------------------');
  console.log(action);
  console.log(state);

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

  if (global.signIn) {
    if (action.key) {

    }
  }

  return defaultGetStateForAction(action, state);
};
*/
export default App
