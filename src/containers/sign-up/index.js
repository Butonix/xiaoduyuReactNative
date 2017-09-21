

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView,
  TextInput, Alert, TouchableOpacity, AsyncStorage,
  Picker, Modal
} from 'react-native'

import { NavigationActions } from 'react-navigation'
import RadioForm from 'react-native-simple-radio-button'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signup, signin } from '../../actions/sign'
import gStyles from '../../styles'
import CaptchaButton from '../../components/captcha-button'

import KeyboardSpacer from 'react-native-keyboard-spacer'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

class SignUp extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '注册'
  })

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      captchaId: null,
      captcha: '',
      error: {}
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  submit() {
    const self = this
    const { nickname, email, password, captcha, gender } = this.state
    const { signup, signin, navigation } = this.props

    if (!nickname || nickname.replace(/(^\s+)|(\s+$)/g, '') == '') return Alert.alert('', '请输入昵称')
    // if (nickname.length > 16) Alert.alert('', '昵称不能大于16个字符')
    if (!email) return Alert.alert('', '请输入邮箱')
    if (!captcha) return Alert.alert('', '请输入验证码')
    if (!password) return Alert.alert('', '请输入密码')
    // if (password.length < 6) return Alert.alert('', '密码不能小于6个字符')
    if (!gender) return Alert.alert('', '请选择性别')

    signup({
      data: {
        nickname: nickname,
        email: email,
        password: password,
        captcha: captcha,
        gender: gender == 'male' ? 1 : 0
      },
      callback: (res)=>{

        if (!res.success) {
          self.setState({ error: res.error })
        } else {
          Alert.alert('', '注册成功')

          signin({
            data: { email: email, password: password },
            callback: (res)=>{

              if (!res.success) {
                navigation.goBack()
              } else {
                self.handleSignIn(res.data.access_token)
              }

            }
          })

        }

      }
    })

  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

      AsyncStorage.getItem('token', function(errs, result){

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

  sendCaptcha(callback) {
    const { email } = this.state
    if (!email) return Alert.alert('', '请输入Email')
    callback({ email, type: 'signup' })
  }

  render() {

    const { captchaId } = this.state
    const { nickname, email, password, captcha, gender } = this.state.error

    var radio_props = [
      {label: '男     ', value: 'male' },
      {label: '女     ', value: 'female' }
    ];

    return (<ScrollView style={styles.container}>
      <View style={gStyles.m20}>

        <TextInput
          style={gStyles.radiusInputTop}
          onChangeText={(nickname) => this.setState({nickname})}
          placeholder='昵称'
          maxLength={40}
          />

        {nickname ? <View style={gStyles.radiusInputCenter}><Text style={gStyles.darkGray}>{nickname}</Text></View> : null}

        <TextInput
          style={gStyles.radiusInputCenter}
          autoCapitalize="none"
          onChangeText={(email) => this.setState({email})}
          placeholder='电子邮箱'
          maxLength={60}
          />

        {email ? <View style={gStyles.radiusInputCenter}><Text style={gStyles.darkGray}>{email}</Text></View> : null}

        <View>
          <TextInput
            style={gStyles.radiusInputCenter}
            onChangeText={(captcha) => this.setState({captcha})}
            placeholder='验证码'
            maxLength={6}
            keyboardType={'numeric'}
            />
          <View style={{
            position: 'absolute',
            marginTop: 0,
            height:45,
            justifyContent: 'center',
            marginLeft: screenWidth - 150
          }}>
            <CaptchaButton sendCaptcha={this.sendCaptcha} />
          </View>
        </View>

        {captcha ? <View style={gStyles.radiusInputCenter}><Text style={gStyles.darkGray}>{captcha}</Text></View> : null}

        <TextInput
          style={gStyles.radiusInputCenter}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='密码'
          maxLength={30}
          />

        {password ? <View style={gStyles.radiusInputCenter}><Text style={gStyles.darkGray}>{password}</Text></View> : null}

        <View style={gender ? gStyles.radiusInputCenter : gStyles.radiusInputBottom}>
          <RadioForm
            radio_props={radio_props}
            initial={3}
            formHorizontal={true}
            onPress={(gender) => this.setState({gender})}
          />
        </View>

        {gender ? <View style={gStyles.radiusInputBottom}><Text style={gStyles.darkGray}>{gender}</Text></View> : null}

        <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles.mt20]}>
          <Text style={gStyles.white}>注册</Text>
        </TouchableOpacity>

    </View>
    <KeyboardSpacer />
    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffff'
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signup: bindActionCreators(signup, dispatch),
    signin: bindActionCreators(signin, dispatch)
  })
)(SignUp)
