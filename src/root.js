
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Text, View, AsyncStorage, NetInfo, StyleSheet, ActivityIndicator,
  TouchableOpacity
} from 'react-native'

import reducers, { getInitialState } from './reducers'
import getStore from './store/configure-store.js'
import Navigators from './navigators/index'

import SplashScreen from 'react-native-splash-screen'
// import * as launchImage from 'react-native-launch-image'

import { combineReducers, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadUserInfo, addAccessToken, cleanUserInfo } from './actions/user'
import { cleanAllPosts } from './actions/posts'

const store = getStore()

global.cleanRedux = () => {
  cleanUserInfo()(store.dispatch, store.getState)
  cleanAllPosts()(store.dispatch, store.getState)
}

global.initReduxDate = (callback) => {
  global.cleanRedux()

  AsyncStorage.getItem('token', function(errs, result){

    if (!result) {
      callback(false)
      return
    }

    loadUserInfo({
      accessToken: result,
      callback: (res)=>{

        if (res.success) {
          addAccessToken({ accessToken:  result })(store.dispatch, store.getState)

          callback(true)

          // global.signIn = true

          // self.setState({ ready: true })

          SplashScreen.hide();
          // launchImage.hide()
        } else {
          AsyncStorage.removeItem('token', function(res){
            callback(false)
            // self.setState({ ready: true })
            // launchImage.hide()
            SplashScreen.hide();
          })(store.dispatch, store.getState)
        }

      }
    })(store.dispatch, store.getState)

  })

}

class MainApp extends Component {

  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      loading: true,
      network: false
    }

    this.start = this.start.bind(this)
  }

  start() {

    const self = this

    self.setState({ loading: true })

    function handleFirstConnectivityChange(state) {

      if (!state) {
        self.setState({ loading: false })
      } else {
        global.initReduxDate((result)=>{
          global.signIn = result
          self.setState({ loading: false, network: true, ready: true })
        })
      }

      NetInfo.isConnected.removeEventListener(
        'change',
        handleFirstConnectivityChange
      )
    }

    NetInfo.isConnected.addEventListener(
      'change',
      handleFirstConnectivityChange
    )

  }

  componentDidMount() {
    global.signIn = false
    SplashScreen.hide()
    this.start()
  }

  render() {

    const { loading, network, ready } = this.state

    if (loading) {
      return (<View style={styles.loading}>
        <ActivityIndicator animating={true} color={'#484848'} size={'small'} />
      </View>)
    }

    if (!loading && !network) {
      return (<View style={styles.loading}>
        <Text>连接网络失败</Text>
        <TouchableOpacity onPress={this.start}>
          <Text>重新连接</Text>
        </TouchableOpacity>
      </View>)
    }

    return (
      <Provider store={store}>
        <Navigators />
      </Provider>
    );
  }
}

var styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default MainApp
