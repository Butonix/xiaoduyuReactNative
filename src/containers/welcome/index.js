
import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, AppState,
  TouchableOpacity,
  NetInfo
} from 'react-native'

import { NavigationActions } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'
import JPushModule from 'jpush-react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'
import { loadUnreadCount, loadNewNotifications, cancelNotiaction } from '../../actions/notification'
import { api_url } from '../../../config'

import Loading from '../../components/ui/loading'

import websocket from '../../common/websocket'
// import jpush from '../../common/jpush'

class Welcome extends Component {

  static navigationOptions = ({navigation}) => ({
    header: null
  })

  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      network: false,
      notification: null
    }
    this.handleMessage = this.handleMessage.bind(this)
    this.testNetwork = this.testNetwork.bind(this)
    this.enterApp = this.enterApp.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentWillMount() {
    const self = this
    JPushModule.addOpenNotificationLaunchAppListener((result) => {
      self.state.notification = result
      JPushModule.setBadge(0, ()=>{})
    })
  }

  componentDidMount() {

    const self = this

    SplashScreen.hide()
    self.testNetwork((result)=>{
      self.setState({ network: result, loading: result })

      if (!result) return

      global.initReduxDate((result)=>{
        global.signIn = result ? true : false
        self.state.loading = false
        self.enterApp()
      })

    })
  }

  // websocket 执行的消息
  handleMessage(name, data) {

    const { me, loadUnreadCount, loadNewNotifications, cancelNotiaction, navigation } = this.props

    switch (name) {
      case 'notiaction':
        if (data.indexOf(me._id) != -1) {
          loadUnreadCount({
            callback: (unreadNotice)=>{

              const setParamsAction = NavigationActions.setParams({
                params: { unreadNotice, loadNewNotifications },
                key: 'Notifications',
              })
              navigation.dispatch(setParamsAction)

            }
          })

        }
        break
      case 'cancel-notiaction':
        cancelNotiaction({
          id: data,
          callback: (unreadNotice)=>{
            const setParamsAction = NavigationActions.setParams({
              params: { unreadNotice, loadNewNotifications },
              key: 'Notifications',
            })
            navigation.dispatch(setParamsAction)
          }
        })

        break
      case 'online-user-count':
        // console.log(data);
        break
    }
  }

  // 进入主程序
  enterApp() {
    const self = this
    const { me, navigation } = this.props

    const { navigate } = this.props.navigation
    const { notification } = this.state

    let actions = []
    let index = 0

    if (global.signIn) {

      // 已登陆
      actions.push(NavigationActions.navigate({ routeName: 'Main' }))

      // 启动websocket
      websocket.start({ onmessage: this.handleMessage })
      // 获取通知
      self.handleMessage('notiaction', [me._id])

      // 显示推送页面
      if (notification && notification.routeName && notification.params) {
        index = 1
        actions.push(NavigationActions.navigate({
          routeName: notification.routeName,
          params: notification.params
        }))
      }

    } else {
      actions.push(NavigationActions.navigate({ routeName: 'FastSignIn' }))
    }

    this.props.navigation.dispatch(NavigationActions.reset({ index, actions }))
  }

  // 测试是否有网
  testNetwork(callback) {
    this.setState({ loading: true })
    function handleFirstConnectivityChange(state) {
      // console.log('网络状态:' + state);
      callback(state)
      NetInfo.isConnected.removeEventListener('change', handleFirstConnectivityChange)
    }
    NetInfo.isConnected.addEventListener('change', handleFirstConnectivityChange)
  }

  render() {

    const { loading, network } = this.state

    if (loading) {
      return (<View style={styles.container}><Loading /></View>)
    } else if (!network) {
      return (<View style={styles.container}>
        <Text>连接网络失败</Text>
        <TouchableOpacity onPress={this.componentDidMount}>
          <Text>重新连接</Text>
        </TouchableOpacity>
      </View>)
    }

    return (<View style={styles.container}><Loading /></View>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(
  (state, props) => {
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch, props) => ({
    loadUnreadCount: bindActionCreators(loadUnreadCount, dispatch),
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch),
    cancelNotiaction: bindActionCreators(cancelNotiaction, dispatch)
  })
)(Welcome)
