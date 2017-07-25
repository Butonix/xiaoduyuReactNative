

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { getCaptchaId } from '../../actions/captcha'
import { cleanAllPosts } from '../../actions/posts'
import { cleanUserInfo } from '../../actions/user'

import { api_url, api_verstion } from '../../../config'


class Forgot extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '重置密码'
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

        AsyncStorage.setItem('token', res.data.access_token, function(errs, result){

          AsyncStorage.getItem('token', function(errs, result){

            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Main'})
              ]
            })


            global.initReduxDate(()=>{

              self.props.navigation.dispatch(resetAction)

              // if (routeName) {
              //   const resetAction = NavigationActions.reset({
              //     index: 0,
              //     actions: [
              //       NavigationActions.navigate({ routeName: routeName })
              //     ]
              //   })
              //
              //   self.props.navigation.dispatch(resetAction)
              // } else {

              // }


            })



            /*
            global.cleanRedux()
            global.initReduxDate(()=>{

              console.log('13123');
              global.signIn = true
              navigation.goBack()


              // if (routeName) {
              //   const resetAction = NavigationActions.reset({
              //     index: 0,
              //     actions: [
              //       NavigationActions.navigate({ routeName: routeName })
              //     ]
              //   })
              //
              //   self.props.navigation.dispatch(resetAction)
              // } else {

              // }


            })
            */




            // navigation.goBack()
            // navigate('Home', {})
            // console.log(result);
          })

        })

      }
    })

  }

  render() {

    const { captchaId } = this.state

    return (<View style={styles.container}>

      <TextInput
          style={styles.input}
          onChangeText={(email) => this.setState({email})}
          placeholder='请输入你的注册邮箱'
        />

      <TextInput
          style={styles.input}
          onChangeText={(captcha) => this.setState({captcha})}
          secureTextEntry={true}
          placeholder='验证码'
        />

        <TouchableOpacity onPress={this.submit} style={styles.button}>
          <Text style={styles.buttonText}>获取验证码</Text>
        </TouchableOpacity>

        <TextInput
            style={styles.input}
            onChangeText={(password) => this.setState({password})}
            secureTextEntry={true}
            placeholder='密码'
          />

          <TextInput
              style={styles.input}
              onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              secureTextEntry={true}
              placeholder='再次输入密码'
            />

      <TouchableOpacity onPress={this.submit} style={styles.button}>
        <Text style={styles.buttonText}>提交</Text>
      </TouchableOpacity>


    </View>)
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
)(Forgot)
