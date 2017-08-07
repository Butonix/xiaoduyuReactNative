import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetNickname, loadUserInfo } from '../../actions/user'
import { ListItem } from '../../components/ui'

import gStyles from '../../styles'

class ResetNickname extends React.Component {

  static navigationOptions = {
    title: '设置'
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
    const { resetNickname, loadUserInfo } = this.props
    const { nickname, submitting } = this.state
    const { navigation } = this.props

    if (!nickname) {
      Alert.alert('', '请输入您的名字')
      return
    }

    if (submitting) {
      return
    }

    self.setState({ submitting: true })

    resetNickname({
      nickname: nickname,
      callback: (res) => {

        if (!res.success) {
          self.setState({ submitting: true })
          Alert.alert('', res.error)
        } else {

          loadUserInfo({
            callback: ()=>{

              self.setState({ submitting: true })

              Alert.alert('', '提交成功')
              navigation.goBack()
            }
          })

        }
      }
    })

  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<View>
              <TextInput
                  style={gStyles.input}
                  autoCapitalize="none"
                  onChangeText={(nickname) => this.setState({nickname})}
                  placeholder='你的名字'
                  defaultValue={me.nickname}
                />

              <TouchableOpacity onPress={this.submit}>
                <ListItem type="center" name={submitting ? "提交中..." : "提交"} />
              </TouchableOpacity>
          </View>)
  }
}

const styles = StyleSheet.create({
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    resetNickname: bindActionCreators(resetNickname, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetNickname);
