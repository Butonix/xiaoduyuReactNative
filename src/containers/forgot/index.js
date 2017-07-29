import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { sendEmailCaptcha, resetPasswordByCaptcha } from '../../actions/account'

import gStyles from '../../styles'

import CaptchaButton from '../../components/captcha-button'

class Forgot extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '通过邮箱重置密码'
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
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  sendCaptcha(callback) {
    const { email } = this.state
    if (!email) return Alert.alert('', '请输入邮箱')
    callback({ email, type: 'forgot' })
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

  submit() {

    const { email, captcha, password, confirmPassword } = this.state
    const { resetPasswordByCaptcha, signin, navigation } = this.props

    if (!email) return Alert.alert('', '请输入邮箱')
    if (!captcha) return Alert.alert('', '验证码')
    if (!password) return Alert.alert('', '请输入新密码')
    if (!confirmPassword) return Alert.alert('', '请再次输入新密码')
    if (password != confirmPassword) return Alert.alert('', '两次密码输入不一致')

    resetPasswordByCaptcha({
      email: email,
      captcha: captcha,
      newPassword: password,
      callback: function(result) {

        if (result.success) {
          alert('密码修改成功')

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

        } else {
          Alert.alert('', result.error || '密码修改失败')
        }
      }
    })

  }

  render() {

    return (<ScrollView style={styles.container}>

      <View style={gStyles.item}>
        <TextInput
            style={gStyles.input}
            autoCapitalize="none"
            onChangeText={(email) => this.setState({email})}
            placeholder='请输入你的注册邮箱'
          />
      </View>

      <View style={gStyles.rowItem}>
        <View style={styles.itemLeft}>
          <TextInput
              style={gStyles.input}
              onChangeText={(captcha) => this.setState({captcha})}
              placeholder='请输入验证码'
            />
        </View>
        <View>
          <CaptchaButton sendCaptcha={this.sendCaptcha} />
        </View>
      </View>

      <View style={gStyles.item}>
        <TextInput
            style={gStyles.input}
            onChangeText={(password) => this.setState({password})}
            secureTextEntry={true}
            placeholder='请输入新密码'
          />
      </View>

      <View style={gStyles.item}>
        <TextInput
            style={gStyles.input}
            onChangeText={(confirmPassword) => this.setState({confirmPassword})}
            secureTextEntry={true}
            placeholder='请再次输入新密码'
          />
      </View>

      <TouchableOpacity onPress={this.submit} style={styles.button}>
        <Text style={styles.buttonText}>提交</Text>
      </TouchableOpacity>

    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20
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
  itemLeft: {
    flex: 1
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signin: bindActionCreators(signin, dispatch),
    resetPasswordByCaptcha: bindActionCreators(resetPasswordByCaptcha, dispatch)
  })
)(Forgot)
