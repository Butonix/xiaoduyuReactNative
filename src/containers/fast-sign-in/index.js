

import React, { Component } from 'react'
import { StyleSheet, Text, Image, ImageBackground, View, Button, ScrollView, WebView, TextInput, Alert, TouchableOpacity, AsyncStorage, DeviceEventEmitter, Linking } from 'react-native'

import { NavigationActions } from 'react-navigation'

import openShare from 'react-native-open-share'
import KeyboardSpacer from 'react-native-keyboard-spacer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { weiboGetUserInfo, QQGetUserInfo } from '../../actions/oauth'

// console.log(openShare);

// import Share from 'react-native-open-share/share-ios/share'

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
      password: '',
      qq: false,
      weibo: false
    }
    this._weiboLogin = this._weiboLogin.bind(this)
    this._qqLogin = this._qqLogin.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  componentWillMount() {

    const self = this

    Linking.canOpenURL('weibo://').then(function(result){
      self.setState({ weibo: result })
    })

    Linking.canOpenURL('mqq://').then(function(result){
      // console.log(result);
      self.setState({ qq: result })
    })
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
  }

  render() {

    const self = this

    const { navigate } = this.props.navigation
    const { qq, weibo } = this.state

    return (<View style={styles.container} keyboardShouldPersistTaps={'always'}>

        <View style={styles.logoMain}>
          <Image source={require('./images/logo.png')} style={styles.logo} />
        </View>

        {qq ?
          <TouchableOpacity onPress={this._qqLogin} style={styles.fullButton}>
            <Text style={styles.buttonText}>使用QQ账号登录</Text>
          </TouchableOpacity>
          : null}

        <TouchableOpacity onPress={()=>{ navigate('GithubSignIn', { successCallback: token => self.handleSignIn(token) }) }} style={styles.fullButton}>
          <Text style={styles.buttonText}>使用Github账号登录</Text>
        </TouchableOpacity>

        {weibo ?
          <TouchableOpacity onPress={this._weiboLogin} style={styles.fullButton}>
            <Text style={styles.buttonText}>使用微博账号登录</Text>
          </TouchableOpacity>
          : null}

        <TouchableOpacity onPress={()=>navigate('SignIn')} style={styles.fullButton}>
          <Text style={styles.buttonText}>使用邮箱注册或登陆</Text>
        </TouchableOpacity>

        <View style={{flex:1}}></View>

        <View style={styles.protocol}><Text style={styles.protocolText}>登陆即表示同意 用户协议</Text></View>

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
    color: '#0f98d8'
  },
  logoMain: {
    height:screenHeight*0.35,
    paddingTop: 20,
    marginBottom:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#0f98d8'
  },
  logo: {
    width:90,
    height:90
  },
  protocol:{
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  protocolText: {
    fontSize:12,
    color:'rgb(145, 145, 145)'
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    weiboGetUserInfo: bindActionCreators(weiboGetUserInfo, dispatch),
    QQGetUserInfo: bindActionCreators(QQGetUserInfo, dispatch)
  })
)(FastSignIn)
