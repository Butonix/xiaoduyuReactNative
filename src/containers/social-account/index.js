import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, Button, TouchableOpacity } from 'react-native'

// import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { unbindingSocialAccount } from '../../actions/oauth'
// import { ListItem } from '../../components/ui'
// import gStyles from '../../styles'

class SocialAccount extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    let title = ''

    switch (params.socialName) {
      case 'qq': title = '腾讯QQ'; break;
      case 'weibo': title = '微博'; break;
      case 'github': title = 'GitHub'; break;
    }

    return {
      title: title
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.binding = this.binding.bind(this)
    this.unbinding = this.unbinding.bind(this)
  }

  unbinding() {

  }

  binding() {

  }

  render() {
    const { me } = this.props
    const { socialName } = this.props.navigation.state.params

    let name = ''

    switch (socialName) {
      case 'qq': name = '腾讯QQ'; break;
      case 'weibo': name = '微博'; break;
      case 'github': name = 'GitHub'; break;
    }

    return (<View style={styles.container}>
      <Text>{me[socialName] ? '已绑定' : '绑定'}{name}</Text>
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:10,
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    unbindingSocialAccount: bindActionCreators(unbindingSocialAccount, dispatch)
  })
)(SocialAccount);
