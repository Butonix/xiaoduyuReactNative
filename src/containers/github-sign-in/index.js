

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, WebView } from 'react-native'

import { NavigationActions } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class Test extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: 'GitHub 登陆'
  })

  constructor (props) {
    super(props)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

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

  }

  onNavigationStateChange(navState) {
    if (navState.url && navState.url.indexOf('https://www.xiaoduyu.com/oauth?access_token=') != -1) {
      const token = navState.url.replace('https://www.xiaoduyu.com/oauth?access_token=', '').split('&')[0]
      this.handleSignIn(token)
    }
  }

  render() {
    return (<View style={styles.container}>
      <WebView
        ref={'webview'}
        automaticallyAdjustContentInsets={false}
        style={styles.webView}
        source={{uri: 'https://api.xiaoduyu.com/oauth/github'}}
        javaScriptEnabled={true}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
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
  webView: {

  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
  })
)(Test)
