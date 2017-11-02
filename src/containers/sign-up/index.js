

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
import SelectCountry from '../../components/select-country'

import KeyboardSpacer from 'react-native-keyboard-spacer'
import Wait from '../../components/ui/wait'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width



class SignUp extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '注册'
  })

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      captchaId: null,
      captcha: '',
      error: {},
      visible: false,
      areaCode: '',
      submitting: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  submit() {

    if (this.state.submitting) return

    const self = this
    const { nickname, account, password, captcha, gender, areaCode } = this.state
    const { signup, signin, navigation } = this.props

    if (!nickname || nickname.replace(/(^\s+)|(\s+$)/g, '') == '') return Alert.alert('', '请输入名字')
    if (!areaCode) return Alert.alert('', '请选择区号')
    if (!account) return Alert.alert('', '请输入手机号')
    if (!captcha) return Alert.alert('', '请输入验证码')
    if (!password) return Alert.alert('', '请输入密码')
    if (!gender) return Alert.alert('', '请选择性别')

    self.setState({ visible: true })

    self.state.submitting = true

    signup({
      data: {
        nickname: nickname,
        phone: account,
        area_code: areaCode,
        password: password,
        captcha: captcha,
        gender: gender == 'male' ? 1 : 0,
        source: 5
      },
      callback: (res)=>{

        self.state.submitting = false

        if (!res.success) {
          self.setState({ error: res.error, visible: false })
        } else {

          self.setState({ visible: false })

          signin({
            data: { phone: account, password: password },
            callback: (res)=>{

              Alert.alert('', '注册成功')

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
    const { account, areaCode } = this.state
    if (!areaCode) return Alert.alert('', '请输入手机区号未选择')
    if (!account) return Alert.alert('', '请输入手机号')
    callback({ phone: account, area_code: areaCode, type: 'signup' })
  }

  render() {

    const self = this
    const { captchaId } = this.state
    const { nickname, phone, password, captcha, gender } = this.state.error

    var radio_props = [
      {label: '男     ', value: 'male' },
      {label: '女     ', value: 'female' }
    ]

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
      <View style={gStyles.m20}>

        <TextInput
          style={gStyles.radiusInputTop}
          onChangeText={(nickname) => this.setState({nickname})}
          placeholder='名字'
          maxLength={40}
          autoFocus={true}
          />

        {nickname ? <View style={gStyles.radiusInputCenter}><Text style={gStyles.darkGray}>{nickname}</Text></View> : null}

        <View style={{ flexDirection: 'row', borderWidth: 1, marginTop:-1, borderColor: '#e2e2e2', paddingLeft:10 }}>
          <View>
            <SelectCountry
              onChoose={(res)=>{
                self.setState({ areaCode: res.code })
              }}
              />
          </View>
          <View style={{flex:1}}>
          <TextInput
            style={{ height:45, borderLeftWidth: 1, borderColor: '#e2e2e2', paddingLeft:10 }}
            autoCapitalize="none"
            onChangeText={(account) => this.setState({account})}
            placeholder='手机号'
            maxLength={60}
            />
          </View>
        </View>

        {phone ? <View style={gStyles.radiusInputCenter}><Text style={gStyles.darkGray}>{phone}</Text></View> : null}

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

    {this.state.visible ? <Wait /> : null}

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
