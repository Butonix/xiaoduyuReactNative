

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

class SignIn extends Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: '登录',
      headerRight: (<TouchableOpacity onPress={()=>params.signup()}><Text style={{fontSize:17, padding:10}}>注册</Text></TouchableOpacity>)
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
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

    })

  }

  submit() {
    const self = this
    const { email, password, captcha, captchaId } = this.state
    const { signin } = this.props

    const { navigation } = this.props
    const { navigate } = this.props.navigation

    let routeName = ''

    if (!email) {
      Alert.alert('', '请输入邮箱')
      return
    } else if (!password) {
      Alert.alert('', '请输入密码')
      return
    }

    self.setState({ visible: true })

    signin({
      data: { email: email, password: password, captcha: captcha, captcha_id: captchaId },
      callback: (res)=>{

        console.log(res);

        let params = { visible: false }

        if (!res.success) {
          params.error = res.error
          self.loadCaptcha()
        } else {
          self.handleSignIn(res.data.access_token)
        }

        self.setState(params)

      }
    })

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
          onChangeText={(email) => this.setState({email})}
          placeholder='请输入邮箱'
          autoFocus={true}
          maxLength={60}
        />

      <TextInput
          ref="password"
          style={captchaId ? gStyles.radiusInputCenter : gStyles.radiusInputBottom}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='请输入密码'
          maxLength={60}
        />

        {captchaId ?
            <View>
              <TextInput
                  style={gStyles.radiusInputBottom}
                  onChangeText={(captcha) => this.setState({captcha})}
                  placeholder='请输入验证码'
                  maxLength={6}
                  keyboardType={'numeric'}
                />
            <TouchableOpacity onPress={this.loadCaptcha}>
              <View style={{
                position: 'absolute',
                marginTop:-35,
                marginLeft: screenWidth - 130
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

      <KeyboardSpacer />
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
