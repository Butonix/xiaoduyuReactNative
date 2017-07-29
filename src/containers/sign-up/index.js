

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
        gender: gender
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
      {label: '男     ', value: 1 },
      {label: '女     ', value: 0 }
    ];

    return (<ScrollView style={styles.container}>

      {nickname ? <View style={gStyles.item}><Text>{nickname}</Text></View> : null}
      <View style={gStyles.item}>
        <TextInput
            style={gStyles.input}
            onChangeText={(nickname) => this.setState({nickname})}
            placeholder='昵称'
          />
      </View>

      {email ? <View style={gStyles.item}><Text>{email}</Text></View> : null}
      <View style={gStyles.item}>
        <TextInput
            style={gStyles.input}
            autoCapitalize="none"
            onChangeText={(email) => this.setState({email})}
            placeholder='电子邮箱'
          />
      </View>

      {captcha ? <View style={gStyles.item}><Text>{captcha}</Text></View> : null}
      <View style={gStyles.rowItem}>
        <View style={styles.itemLeft}>
          <TextInput
              style={gStyles.input}
              onChangeText={(captcha) => this.setState({captcha})}
              placeholder='验证码'
            />
        </View>
        <View>
          <CaptchaButton sendCaptcha={this.sendCaptcha} />
        </View>
      </View>

      {password ? <View style={gStyles.item}><Text>{password}</Text></View> : null}
      <View style={gStyles.item}>
        <TextInput
            style={gStyles.input}
            onChangeText={(password) => this.setState({password})}
            secureTextEntry={true}
            placeholder='密码'
          />
      </View>

      {gender ? <View style={gStyles.item}><Text>{gender}</Text></View> : null}
      <View style={gStyles.item}>
        <RadioForm
          radio_props={radio_props}
          initial={3}
          formHorizontal={true}
          onPress={(gender) => this.setState({gender})}
        />
      </View>

      <TouchableOpacity onPress={this.submit} style={gStyles.fullButton}>
        <Text style={styles.buttonText}>注册</Text>
      </TouchableOpacity>

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
  item: {
    marginBottom: 10
  },
  itemLeft: {
    flex: 1
  },
  captchaButton:{
    width: 100,
    backgroundColor:'#63B8FF',
    height:40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  genderPicker: {
    height: 200,
    backgroundColor:'#333',
    alignSelf: 'flex-end'
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
