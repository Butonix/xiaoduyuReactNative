

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, AppState } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'
import { loadUnreadCount } from '../../actions/notification'
import { api_url } from '../../../config'

// import io from 'socket.io-client'
// let ws = null

class Welcome extends Component {

  static navigationOptions = ({navigation}) => ({
    header: null
    // headerTitle: '登录'
  })

  constructor (props) {
    super(props)
    this.state = {}
    this.runWebSokcet = this.runWebSokcet.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleMessage(name, data) {

    const { me, loadUnreadCount, navigation } = this.props

    switch (name) {
      case 'notiaction':

        if (data.indexOf(me._id) != -1) {
          // console.log('需要更新');
          loadUnreadCount({
            callback: (unreadNotice)=>{

              const setParamsAction = NavigationActions.setParams({
                params: { unreadNotice: unreadNotice },
                key: 'Notifications',
              })
              navigation.dispatch(setParamsAction)

            }
          })

        }
        break
      case 'online-user-count':
        console.log(data);
        break
    }
  }

  // 启动websocket
  runWebSokcet () {

    const self = this
      /*

    // 强制指定使用 websocket 作为传输通道
    let socket = io.connect(api_url, {
        transports: ['websocket']
    });


    socket.on('connect', function(){

      // console.log('1312312');

      this.on('online-user-count', (res)=>{
        console.log(res);
      })

      // setInterval(()=>{
      //   console.log('心跳');
      //   socket.emit('heartbeat')
      // }, 1000 * 60)

    });
    */


    let ws = new WebSocket(api_url+'/socket.io/?transport=websocket');

    ws.onopen = () => {
      // console.log('连接成功');
    }

    ws.onmessage = (e) => {
      // 接收到了一个消息

      let re = /\[(.*?)\]$/
      let data = e.data.match(re)

      if (data && data[0]) {
        data = JSON.parse(data[0])
        self.handleMessage(data[0], data[1])
      }

    }

    ws.onerror = (e) => {
      // 发生了一个错误
      console.log(e.message);
    }

    ws.onclose = self.runWebSokcet
  }

  // _handleAppStateChange = (appState) => {
  //     if (Platform.OS === 'ios' && appState === 'inactive' ) {
  //         ws.close();
  //     }
  //
  //     if (Platform.OS === 'android' && appState === 'background') {
  //         ws.close();
  //     }
  //
  //     if (appState === 'active') {
  //         ws.open();
  //     }
  // }

  componentDidMount() {

    const self = this
    const { me, loadUnreadCount, navigation } = this.props

    // AppState.addEventListener('change', this._handleAppStateChange);

    let routeName = 'SignIn'

    if (global.signIn) {
      routeName = 'Main'
      self.runWebSokcet()
      self.handleMessage('notiaction', [me._id])
    }

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName })
      ]
    })

    this.props.navigation.dispatch(resetAction)

  }

  componentWillUnmount() {
    console.log('页面卸载了');
  }

  render() {

    const { navigate } = this.props.navigation

    return (<View style={styles.container}>
    </View>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
})

export default connect(
  (state, props) => {
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch, props) => ({
    loadUnreadCount: bindActionCreators(loadUnreadCount, dispatch)
  })
)(Welcome)
