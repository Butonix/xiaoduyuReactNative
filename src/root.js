
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Text, View, AsyncStorage, NetInfo, StyleSheet, ActivityIndicator,
  DeviceEventEmitter, NativeAppEventEmitter,
  TouchableOpacity
} from 'react-native'

// import reducers, { getInitialState } from './reducers'
import getStore from './store/configure-store.js'
import Navigators from './navigators/index'

// import { connect } from 'react-redux'
// import { combineReducers, bindActionCreators } from 'redux'
import { loadUserInfo, addAccessToken, cleanUserInfo } from './actions/user'
import { loadUnreadCount, cleanAllNotification } from './actions/notification'
import { cleanAllPosts } from './actions/posts'
import { cleanAllComment } from './actions/comment'
import { cleanAllFollow } from './actions/follow'
import { cleanAllPeople } from './actions/people'
import { cleanAllTopic } from './actions/topic'

import { checkClientInstalled } from './actions/client-installed'

import JPushModule from 'jpush-react-native'

let store = getStore()

// 解决该组建，启动黑底的问题
// import { Theme } from 'teaset'
// Theme.set({ screenColor: '#fff', })

import Dimensions from 'Dimensions'

global.screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

global.cleanRedux = () => {
  cleanUserInfo()(store.dispatch, store.getState)
  cleanAllPosts()(store.dispatch, store.getState)
  cleanAllComment()(store.dispatch, store.getState)
  cleanAllNotification()(store.dispatch, store.getState)
  cleanAllFollow()(store.dispatch, store.getState)
  cleanAllPeople()(store.dispatch, store.getState)
  cleanAllTopic()(store.dispatch, store.getState)
}

global.initReduxDate = (callback) => {
  global.cleanRedux()

  // 检测是否安装了某些客户端
  checkClientInstalled()(store.dispatch, store.getState)

  AsyncStorage.getItem('token', (errs, result)=>{

    if (!result) {
      callback(false)
      return
    }

    loadUserInfo({
      accessToken: result,
      callback: (res)=>{

        if (res.success) {
          addAccessToken({ accessToken:  result })(store.dispatch, store.getState)
          callback(res.data)
        } else {
          AsyncStorage.removeItem('token',(res)=>{
            callback(false)
          })
        }

      }
    })(store.dispatch, store.getState)

  })

}


class MainApp extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Provider store={store}>
        <Navigators />
      </Provider>
    )
  }
}


export default MainApp
