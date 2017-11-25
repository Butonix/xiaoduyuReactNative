

import React, { Component } from 'react'
import { StyleSheet, Text, Image, ImageBackground, View, Button, ScrollView, WebView, TextInput, Alert, TouchableOpacity, AsyncStorage, DeviceEventEmitter, Modal } from 'react-native'

import { NavigationActions } from 'react-navigation'

import openShare from 'react-native-open-share'
import * as QQAPI from 'react-native-qq'
import KeyboardSpacer from 'react-native-keyboard-spacer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { weiboGetUserInfo, QQGetUserInfo } from '../../actions/oauth'
import { getClientInstalled } from '../../reducers/client-installed'


import gStyles from '../../styles'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

class FastSignIn extends Component {

  static navigationOptions = ({navigation}) => ({
    header: null,
    headerTitle: '欢迎页'
  })

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this._weiboLogin = this._weiboLogin.bind(this)
    this._qqLogin = this._qqLogin.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  componentDidMount() {

    // console.log(QQAPI);
    // console.log('test');
  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Main'})
        ]
      })

      global.initReduxDate(()=>{
        self.props.navigation.dispatch(resetAction)
      })

    })

  }

  _weiboLogin () {
      var _this = this;
      openShare.weiboLogin();

      const { weiboGetUserInfo } = this.props

      if (!_this.weiboLogin) {
          _this.weiboLogin = DeviceEventEmitter.addListener(
              'managerCallback', (response) => {

                  weiboGetUserInfo({
                    data: {
                      weibo_access_token: response.res.accessToken,
                      refresh_token: response.res.refreshToken,
                      user_id: response.res.userID,
                      expiration_date: response.res.expirationDate
                    },
                    callback: (res)=>{
                      if (res.success) {
                        _this.handleSignIn(res.data.access_token)
                      }
                    }
                  })

                  _this.weiboLogin.remove();
                  delete _this.weiboLogin;
              }
          );
      }
  }

  _qqLogin () {

    const self = this
    const { QQGetUserInfo } = this.props

    QQAPI.login().then((res)=>{
      if (res &&
          res.expires_in &&
          res.openid &&
          res.access_token
      ) {

        console.log('test----');

        console.log(res);

        QQGetUserInfo({
          data: {
            qq_access_token: res.access_token,
            refresh_token: '',
            openid: res.openid,
            expires_in: res.expires_in
          },
          callback: (res)=>{
            if (res.success) {
              self.handleSignIn(res.data.access_token)
            }
          }
        })

      }
    })

      /*
      var _this = this;
      openShare.qqLogin()

      const { QQGetUserInfo } = this.props

      if (!_this.qqLogin) {
          _this.qqLogin = DeviceEventEmitter.addListener(
              'managerCallback', (response) => {

                  QQGetUserInfo({
                    data: {
                      qq_access_token: response.res.access_token,
                      refresh_token: '',
                      openid: response.res.openid,
                      expires_in: response.res.expires_in
                    },
                    callback: (res)=>{
                      if (res.success) {
                        _this.handleSignIn(res.data.access_token)
                      }
                    }
                  })

                  _this.qqLogin.remove();
                  delete _this.qqLogin;
              }
          );
      }
      */
  }

  render() {

    const self = this

    const { navigate } = this.props.navigation
    const { clientInstalled } = this.props

    return (<View style={styles.container} keyboardShouldPersistTaps={'always'}>

        <View style={styles.logoMain}>
          <Image source={require('./images/logo.png')} style={styles.logo} resizeMode="cover" />
        </View>

        {clientInstalled.qq ?
          <TouchableOpacity onPress={this._qqLogin} style={styles.fullButton}>
            <Text style={styles.buttonText}>使用QQ账号登录</Text>
          </TouchableOpacity>
          : null}

        <TouchableOpacity onPress={()=>{ navigate('GithubSignIn', { successCallback: token => self.handleSignIn(token) }) }} style={styles.fullButton}>
          <Text style={styles.buttonText}>使用Github账号登录</Text>
        </TouchableOpacity>

        {clientInstalled.weibo ?
          <TouchableOpacity onPress={this._weiboLogin} style={styles.fullButton}>
            <Text style={styles.buttonText}>使用微博账号登录</Text>
          </TouchableOpacity>
          : null}

        <TouchableOpacity onPress={()=>navigate('SignIn')} style={styles.fullButton}>
          <Text style={styles.buttonText}>手机号登陆或注册</Text>
        </TouchableOpacity>

        <View style={{flex:1}}></View>

        <View style={styles.protocol}>
          <Text style={styles.protocolText}>登陆即表示您同意</Text>
          <Text style={[styles.protocolText, styles.green]} onPress={()=>{ navigate('Agreement') }}>用户协议</Text>
        </View>

      </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff'
  },

  fullButton: {
    marginTop: 15,
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#277eff'
  },
  logoMain: {
    height:screenHeight*0.35,
    paddingTop: 20,
    marginBottom:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#277eff'
  },
  logo: {
    width:90,
    height:90
  },
  protocol:{
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  protocolText: {
    fontSize:12,
    color:'rgb(145, 145, 145)'
  },
  green: {
    color:'rgb(80, 145, 255)',
    marginLeft:10
  }
})

export default connect(
  (state, props) => {
    return {
      clientInstalled: getClientInstalled(state)
    }
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    weiboGetUserInfo: bindActionCreators(weiboGetUserInfo, dispatch),
    QQGetUserInfo: bindActionCreators(QQGetUserInfo, dispatch)
  })
)(FastSignIn)
