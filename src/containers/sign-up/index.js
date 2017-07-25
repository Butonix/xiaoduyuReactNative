

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView,
  TextInput, Alert, TouchableOpacity, AsyncStorage,
  Picker, Modal
} from 'react-native'

import { NavigationActions } from 'react-navigation'
// import { RkChoice, RkTheme } from 'react-native-ui-kitten';
import RadioForm from 'react-native-simple-radio-button'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signup } from '../../actions/sign'
import { getCaptchaId } from '../../actions/captcha'
import { cleanAllPosts } from '../../actions/posts'
import { cleanUserInfo } from '../../actions/user'
import gStyles from '../../styles'


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
    const { nickname, email, password, captcha } = this.state
    const { signup } = this.props

    const { navigation } = this.props
    const { navigate } = this.props.navigation

    if (!nickname || nickname.replace('', '') == '') return Alert.alert('', '请输入昵称')
    if (nickname.length > 16) Alert.alert('', '昵称不能大于16个字符')
    if (!email) return Alert.alert('', '请输入邮箱')
    if (!captcha) return Alert.alert('', '请输入验证码')
    if (!password) return Alert.alert('', '请输入密码')
    if (password.length < 6) return Alert.alert('', '密码不能小于6个字符')

    signup({
      data: {
        nickname: nickname,
        email: email,
        password: password,
        captcha: captcha
      },
      callback: (res)=>{

        if (!res.success) {
          self.setState({ error: res.error })
        }

        // console.log(res.error);

      }
    })

  }

  render() {

    const { captchaId } = this.state
    const { nickname, email, password, captcha, gender } = this.state.error

    let options = ['选项1','选项2','选项3']

    var radio_props = [
      {label: '男     ', value: 1 },
      {label: '女     ', value: 0 }
    ];

    return (<View style={styles.container}>

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
          <TouchableOpacity onPress={this.submit} style={styles.captchaButton}>
            <Text style={styles.buttonText}>获取验证码</Text>
          </TouchableOpacity>
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

      <RadioForm
        radio_props={radio_props}
        initial={3}
        formHorizontal={true}
        onPress={(value) => { console.log(value); }}
      />

      {/*
      <Modal
        transparent={true}
        >
        <View style={styles.genderPicker}>
          <View>
          <Picker
            prompt="性别"
            mode={Picker.MODE_DROPDWN}
            >
            {options.map(item=>{
              return (<Picker.Item
                label={item}
                value={item}
                key={item}
                />)
            })}
          </Picker>
          </View>
        </View>
      </Modal>
      */}

      <View style={gStyles.item}>
        <TouchableOpacity onPress={this.submit} style={gStyles.button}>
          <Text style={styles.buttonText}>注册</Text>
        </TouchableOpacity>
      </View>

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
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch),
    cleanAllPosts: bindActionCreators(cleanAllPosts, dispatch),
    cleanUserInfo: bindActionCreators(cleanUserInfo, dispatch)
  })
)(SignUp)
