import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { resetEmail } from '../../actions/account'
import { ListItem } from '../../components/ui'
import CaptchaButton from '../../components/captcha-button'

import gStyles from '../../styles'

class ResetEmail extends React.Component {

  static navigationOptions = {
    title: '设置新邮箱'
  }

  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this.submit = this.submit.bind(this)
  }

  submit() {

    const self = this
    const { resetEmail, loadUserInfo } = this.props
    const { email, captcha, submitting } = this.state
    const { navigation } = this.props

    if (submitting) return
    if (!email) return Alert.alert('', '请输入你的邮箱')
    if (!captcha) return Alert.alert('', '请输入你的验证码')

    self.setState({ submitting: true })

    resetEmail({
      email,
      captcha,
      callback: (res) => {

        if (!res.success) {
          self.setState({ submitting: true })
          Alert.alert('', res.error)
        } else {

          loadUserInfo({
            callback: ()=>{
              self.setState({ submitting: true })
              // Alert.alert('', '提交成功')
              navigation.goBack()
            }
          })

        }
      }
    })

  }

  sendCaptcha(callback) {
    const { email } = this.state
    if (!email) return Alert.alert('', '请输入新邮箱')
    callback({ email, type: 'reset-email' })
  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<View>
              <TextInput
                  style={gStyles.input}
                  autoCapitalize="none"
                  onChangeText={(email) => this.setState({email})}
                  placeholder='请输入你的新邮箱'
                />

                <View style={gStyles.rowItem}>
                  <View style={styles.itemLeft}>
                    <TextInput
                        style={gStyles.input}
                        onChangeText={(captcha) => this.setState({captcha})}
                        placeholder='验证码'
                      />
                  </View>
                  <View>
                    <CaptchaButton sendCaptcha={this.sendCaptcha.bind(this)} />
                  </View>
                </View>

              <TouchableOpacity onPress={this.submit}>
                <ListItem type="center" name={submitting ? "提交中..." : "提交"} />
              </TouchableOpacity>
          </View>)
  }
}

const styles = StyleSheet.create({
  itemLeft:{
    flex: 1
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetEmail: bindActionCreators(resetEmail, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetEmail);
