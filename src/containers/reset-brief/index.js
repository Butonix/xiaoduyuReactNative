import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, TouchableOpacity } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetBrief, loadUserInfo } from '../../actions/user'
import { ListItem } from '../../components/ui'

import gStyles from '../../styles'

class ResetBrief extends React.Component {

  static navigationOptions = {
    title: '个性签名'
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
    const { resetBrief, loadUserInfo } = this.props
    const { brief, submitting } = this.state
    const { navigation } = this.props

    if (submitting) return
    // if (!brief) return Alert.alert('', '请输入你的个人签名')

    self.setState({ submitting: true })

    resetBrief({
      brief: brief,
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

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<View>
              <TextInput
                  style={gStyles.input}
                  autoCapitalize="none"
                  onChangeText={(brief) => this.setState({brief})}
                  placeholder='请输入你的个人签名'
                  defaultValue={me.brief}
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
    resetBrief: bindActionCreators(resetBrief, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetBrief);
