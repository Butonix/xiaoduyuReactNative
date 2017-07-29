

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, DeviceEventEmitter } from 'react-native'

import { NavigationActions } from 'react-navigation'

import openShare from 'react-native-open-share'
// import KeyboardSpacer from 'react-native-keyboard-spacer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { getCaptchaId } from '../../actions/captcha'
import { cleanAllPosts } from '../../actions/posts'
import { cleanUserInfo } from '../../actions/user'
import { weiboGetUserInfo, QQGetUserInfo } from '../../actions/oauth'

import Fieldset from '../../components/ui/fieldset'

import gStyles from '../../styles'

import { api_url, api_verstion } from '../../../config'


class SignIn extends Component {

  static navigationOptions = ({navigation}) => ({
    // header: null
    // headerTitle: '登录'
  })

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      captchaId: null,
      captcha: ''
    }
    this.submit = this.submit.bind(this)
    this.loadCaptcha = this.loadCaptcha.bind(this)
    this._weiboLogin = this._weiboLogin.bind(this)
    this._qqLogin = this._qqLogin.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  componentWillMount() {

    if (global.signIn) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Main'})
        ]
      })
      this.props.navigation.dispatch(resetAction)
      return
    }

    // console.log('进入了登录界面');

    // const routeName = this.props.navigation.state.params.backRouteName

    // console.log(routeName);

    this.loadCaptcha()
  }

  componentDidMount() {
    // EasyLoading.show('Loading...', 3000, 'type');
    // setTimeout(() => {
    //   EasyLoading.show('Loading...', 3000);
    // }, 3000)
  }

  loadCaptcha() {

    const self = this
    const { getCaptchaId } = this.props

    getCaptchaId({
      callback: function (res) {
        if (res && res.success && res.data) {
          self.setState({ captchaId: res.data })
        }
      }
    })

  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

      // AsyncStorage.getItem('token', function(errs, result){

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Main'})
          ]
        })

        global.initReduxDate(()=>{
          self.props.navigation.dispatch(resetAction)
        })

      // })

    })

  }

  submit() {
    const self = this
    const { email, password, captcha, captchaId } = this.state
    const { signin } = this.props

    const { navigation } = this.props
    const { navigate } = this.props.navigation

    let routeName = ''

    // if (this.props.navigation.state.params.backRouteName) {
    //   routeName = this.props.navigation.state.params.backRouteName
    // }

    // console.log(router);

    if (!email) {
      Alert.alert('', '请输入邮箱')
      return
    } else if (!password) {
      Alert.alert('', '请输入密码')
      return
    }

    signin({
      data: { email: email, password: password, captcha: captcha, captcha_id: captchaId },
      callback: (res)=>{

        if (!res.success) {
          Alert.alert('', res.error)
          self.loadCaptcha()
          return
        }

        self.handleSignIn(res.data.access_token)

      }
    })

  }

  _weiboLogin () {
      var _this = this;
      openShare.weiboLogin();

      if (!_this.weiboLogin) {
          _this.weiboLogin = DeviceEventEmitter.addListener(
              'managerCallback', (response) => {

                // console.log(response);
                // console.log(JSON.stringify(response).accessToken);

                  // let res = {
                  //   access_token: response.accessToken,
                  //   refresh_token: response.refreshToken,
                  //   user_id: response.userID,
                  //   expiration_date: response.expirationDate
                  // }


                      weiboGetUserInfo({
                        data: {
                          access_token: response.res.accessToken,
                          refresh_token: response.res.refreshToken,
                          user_id: response.res.userID,
                          expiration_date: response.res.expirationDate
                        },
                        callback: (res)=>{

                          if (res.success) {
                            _this.handleSignIn(res.data.access_token)
                          }
                          // console.log(res);
                        }
                      })

                  // console.log(JSON.stringify(response));

                  _this.weiboLogin.remove();
                  delete _this.weiboLogin;
              }
          );
      }
  }

  _qqLogin () {
      var _this = this;
      openShare.qqLogin();

      if (!_this.qqLogin) {
          _this.qqLogin = DeviceEventEmitter.addListener(
              'managerCallback', (response) => {
                  // AlertIOS.alert(
                  //     'response',
                  //      JSON.stringify(response)
                  // );


                  QQGetUserInfo({
                    data: {
                      access_token: response.res.access_token,
                      refresh_token: '',
                      openid: response.res.openid,
                      expires_in: response.res.expires_in
                    },
                    callback: (res)=>{

                      if (res.success) {
                        _this.handleSignIn(res.data.access_token)
                      }
                      // console.log(res);
                    }
                  })

                  // console.log(JSON.stringify(response));

                  _this.qqLogin.remove();
                  delete _this.weiboLogin;
              }
          );
      }
  }

  // componentDidMount() {
  //
  //
  //   console.log('2111');
  //
  //   weiboGetUserInfo({
  //     data: {
  //       access_token: '1',
  //       refresh_token: '2',
  //       user_id: '3',
  //       expiration_date: '4'
  //     },
  //     callback: (res)=>{
  //       console.log(res);
  //     }
  //   })
  // }

  render() {

    const { captchaId } = this.state

    const { navigate } = this.props.navigation

    return (<ScrollView style={styles.container}>



      <TouchableOpacity onPress={this._qqLogin} style={gStyles.fullButton}>
        <Text style={styles.buttonText}>通过QQ登录</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={this._weiboLogin} style={gStyles.fullButton}>
        <Text style={styles.buttonText}>通过微博登录</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('GithubSignIn') }} style={gStyles.fullButton}>
        <Text style={styles.buttonText}>通过Github登录</Text>
      </TouchableOpacity>

      <View style={gStyles.item}>
        <Fieldset text="或者通过邮箱登录" />
      </View>

      <TextInput
          style={styles.input}
          onChangeText={(email) => this.setState({email})}
          placeholder='请输入邮箱'
        />

      <TextInput
          style={styles.input}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='请输入密码'
        />

      {captchaId ?
        <View style={styles.captchaContainer}>
          <View style={styles.captchaInput}>
          <TextInput
              style={styles.input}
              onChangeText={(captcha) => this.setState({captcha})}
              placeholder='请输入验证码'
            />
          </View>
          <TouchableOpacity onPress={this.loadCaptcha}>
            <View>
              <Image source={{ uri:api_url + '/' + api_verstion + '/captcha-image/' + captchaId }} style={styles.caption}  />
            </View>
          </TouchableOpacity>
        </View>
        : null}

      <TouchableOpacity onPress={this.submit} style={gStyles.fullButton}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>

      <View style={gStyles.item}>
        <View style={styles.footer}>
          <TouchableOpacity onPress={()=>{ navigate('Forgot') }} style={gStyles.whiteButton}>
            <Text>无法登录?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{ navigate('SignUp') }} style={gStyles.whiteButton}>
            <Text>新用户</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*<KeyboardSpacer />*/}
    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f9',
    flex: 1
  },
  input: {
    height: 40,
    borderColor: '#efefef',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10
  },
  button:{
    backgroundColor:'#63B8FF',
    height:40,
    borderRadius:20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color:'#fff'
  },

  captchaContainer: {
    flexDirection: 'row'
  },
  captchaInput: {
    flex: 1
  },
  caption: {
    width:80,
    height:30,
    marginTop:5,
    marginLeft:10
  },
  footer: {
    flex:1,
    marginTop:30,
    flexDirection:'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  line:{
    flex:1,
    borderColor: '#333',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center'
  },
  lineText: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom:-7
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch),
    cleanAllPosts: bindActionCreators(cleanAllPosts, dispatch),
    cleanUserInfo: bindActionCreators(cleanUserInfo, dispatch)
  })
)(SignIn)
