
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Text, View, AsyncStorage, NetInfo, StyleSheet, ActivityIndicator,
  DeviceEventEmitter, NativeAppEventEmitter,
  TouchableOpacity
} from 'react-native'

import reducers, { getInitialState } from './reducers'
import getStore from './store/configure-store.js'
import Navigators from './navigators/index'

// import SplashScreen from 'react-native-splash-screen'

import { connect } from 'react-redux'
import { combineReducers, bindActionCreators } from 'redux'
import { loadUserInfo, addAccessToken, cleanUserInfo } from './actions/user'
import { loadUnreadCount } from './actions/notification'
import { cleanAllPosts } from './actions/posts'

import JPushModule from 'jpush-react-native'

const store = getStore()

// 解决该组建，启动黑底的问题
import { Theme } from 'teaset'
Theme.set({ screenColor: '#fff', })


global.cleanRedux = () => {
  cleanUserInfo()(store.dispatch, store.getState)
  cleanAllPosts()(store.dispatch, store.getState)
}

global.initReduxDate = (callback) => {
  global.cleanRedux()

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
