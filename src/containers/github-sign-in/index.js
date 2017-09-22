

import React, { Component } from 'react'
import { StyleSheet, View, WebView } from 'react-native'
import { official_website, api_url } from '../../../config'

import Cookie from 'react-native-cookie'

function GetQueryString(url, name) {
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = url.substr(1).match(reg);
   if(r!=null)return  unescape(r[2]); return null;
}

class GithubSignIn extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: 'GitHub 登陆'
  })

  constructor (props) {
    super(props)
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
  }

  onNavigationStateChange(navState) {

    let { successCallback =()=>{}, failCallback =()=>{} } = this.props.navigation.state.params
    const { navigation } = this.props

    if (navState.url && navState.url.indexOf(official_website+'/oauth?access_token=') != -1) {
      const token = navState.url.replace(official_website+'/oauth?access_token=', '').split('&')[0]
      successCallback(token)
      navigation.goBack()
    } else if (navState.url && navState.url.indexOf(official_website+'/notice?') != -1) {

      let result = GetQueryString(navState.url, 'notice')

      if (result == 'binding_finished') {
        successCallback(result)
      } else {
        failCallback(result)
      }

      navigation.goBack()
    }
  }

  componentWillUnmount() {
    Cookie.clear()
    console.log('清除成功');
  }

  render() {

    const { accessToken } = this.props.navigation.state.params

    return (<View style={styles.container}>
      <WebView
        ref={'webview'}
        automaticallyAdjustContentInsets={false}
        source={{uri: 'https://api.xiaoduyu.com/oauth/github'+(accessToken ? '?access_token='+accessToken : '')}}
        javaScriptEnabled={true}
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
})

export default GithubSignIn
