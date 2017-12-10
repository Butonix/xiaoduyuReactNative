

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, WebView, TextInput, Alert, TouchableOpacity, AsyncStorage, DeviceEventEmitter,
  ActivityIndicator
} from 'react-native'

import { NavigationActions } from 'react-navigation'

import KeyboardSpacer from 'react-native-keyboard-spacer'
import Wait from '../../components/ui/wait'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { getCaptchaId } from '../../actions/captcha'

import gStyles from '../../styles'

import { api_url, api_verstion } from '../../../config'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

import Platform from 'Platform'

import HeadButton from '../../components/ui/head-button'

class SignIn extends Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: '登录',
      headerRight: (<TouchableOpacity onPress={()=>params.signup()}><HeadButton name="注册" /></TouchableOpacity>)
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      captchaId: null,
      captcha: '',
      visible: false,
      error: ''
    }
    this.submit = this.submit.bind(this)
    this.loadCaptcha = this.loadCaptcha.bind(this)
    // this._weiboLogin = this._weiboLogin.bind(this)
    // this._qqLogin = this._qqLogin.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.signup = this.signup.bind(this)
  }

  componentWillMount() {
    this.loadCaptcha()
  }

  componentDidMount() {
    this.props.navigation.setParams({
      signup: this.signup
    })
  }

  signup() {
    const { navigate } = this.props.navigation
    navigate('SignUp')
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

    // 储存token
    AsyncStorage.setItem('token', access_token, function(errs, result){
      // 储存token有效时间
      AsyncStorage.setItem('token_expires', (new Date().getTime() + 1000 * 60 * 60 * 24 * 30) + '', function(errs, result){

        global.initReduxDate((result)=>{

          // console.log(result);

          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Welcome' })
            ]
          })

          self.props.navigation.dispatch(resetAction)
        })

      })

    })

  }

  submit() {
    const self = this
    const { account, password, captcha, captchaId } = this.state
    const { signin } = this.props

    const { navigation } = this.props
    const { navigate } = this.props.navigation

    let routeName = ''

    if (!account) return Alert.alert('', '请输入手机号或邮箱')
    if (!password) return Alert.alert('', '请输入密码')

    self.setState({ visible: true })

    let data = {
      email: account.indexOf('@') != -1 ? account : '',
      phone: account.indexOf('@') == -1 ? account : '',
      password
    }

    if (captcha) data.captcha = captcha
    if (captchaId) data.captcha_id = captchaId

    setTimeout(()=>{

      signin({
        data,
        callback: (res)=>{
          if (!res.success) {
            self.loadCaptcha()
            self.setState({
              visible: false,
              error: res.error
            })
          } else {
            self.setState({ visible: false })
            self.handleSignIn(res.data.access_token)
          }

        }
      })

    }, 1000)


  }

  render() {

    const self = this
    const { captchaId, visible, error } = this.state
    const { navigate } = this.props.navigation

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

      {error ? <View style={[gStyles.bgDange, gStyles.mb20]}><Text>账号或密码错误</Text></View> : null}

      <TextInput
          ref="email"
          style={gStyles.radiusInputTop}
          autoCapitalize={'none'}
          onChangeText={(account) => this.setState({account})}
          placeholder='请输入手机号或邮箱'
          autoFocus={true}
          maxLength={60}
          underlineColorAndroid='transparent'
        />

      <TextInput
          ref="password"
          style={captchaId ? gStyles.radiusInputCenter : gStyles.radiusInputBottom}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='请输入密码'
          maxLength={60}
          underlineColorAndroid='transparent'
        />

        {captchaId ?
            <View>
              <TextInput
                  style={gStyles.radiusInputBottom}
                  onChangeText={(captcha) => this.setState({captcha})}
                  placeholder='请输入验证码'
                  maxLength={6}
                  keyboardType={'numeric'}
                  underlineColorAndroid='transparent'
                />
            <TouchableOpacity onPress={this.loadCaptcha}
              style={{
                position: 'absolute',
                marginTop: 10,
                marginLeft: screenWidth - 130
              }}
              >
              <View style={{
                // position: 'absolute',
                // marginTop:-15,
                // marginLeft: screenWidth - 130
              }}>
                <Image source={{ uri:api_url + '/' + api_verstion + '/captcha-image/' + captchaId }} style={{ width:80, height:30 }}  />
              </View>
            </TouchableOpacity>
          </View>
          : null}

      <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles.mt20]}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('Forgot') }} style={gStyles.whiteButton}>
        <Text>无法登录?</Text>
      </TouchableOpacity>

      {visible ? <Wait /> : null}

      {Platform.OS === 'android' ? null : <KeyboardSpacer />}

    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    padding:20
  },
  buttonText: {
    color:'#fff'
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch)
  })
)(SignIn)
