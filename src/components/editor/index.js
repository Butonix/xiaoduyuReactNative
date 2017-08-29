
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Button, Image, ImagePickerIOS, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'

import KeyboardSpacer from 'react-native-keyboard-spacer'

import { WebView } from 'react-native-webview-messaging/WebView'
// import { Loading, EasyLoading } from 'react-native-easy-loading'
import { Toast } from 'teaset'

import { getQiNiuToken } from '../../actions/qiniu'

class Editor extends Component {

  constructor() {
    super()
    this.state = {
      qiniu: null,
      json: '',
      html: ''
    }
    this.addPhoto = this.addPhoto.bind(this)
    this.init = this.init.bind(this)
  }

  componentWillMount() {
    const self = this
    // 获取七牛的token
    this.props.getQiNiuToken({
      callback: (res)=>{
        if (res) self.setState({ qiniu: res })
      }
    })

  }

  componentDidMount() {
    // KeyboardManager.setEnable(true);
  }

  render() {
    const self = this
    const { qiniu } = this.state
    const { style } = this.props

    // source={{uri:'http://192.168.1.107:9000'}}
    // source={require('../../../editor/dist/index.html')}
    return (<View style={styles.container}>

              <WebView
                source={require('../../../editor/dist/index.html')}
                style={styles.editor}
                ref={ webview => { this.webview = webview; }}
                onLoad={()=>{ self.init() }}
                />

            {qiniu ? <View style={styles.control}>
              <TouchableOpacity onPress={this.addPhoto} style={styles.addPhoto}>
                <Image source={require('./images/photo.png')} style={styles.photoIcon} />
              </TouchableOpacity>
              <View style={{flex:1}}></View>
            </View>: null}

            <KeyboardSpacer />
          </View>)
  }

  _refWebView = (webview) => {
    this.webview = webview
  }

  init() {
    const self = this
    const { initialContentJSON, transportContent } = this.props
    const { messagesChannel } = this.webview

    messagesChannel.on('transport-content', transportContent)

    if (initialContentJSON) {
      self.webview.emit('initial-content', initialContentJSON);
    }

  }

  addPhoto = () => {

    const self = this
    const { qiniu } = this.state

    ImagePickerIOS.openSelectDialog({}, function(res){

      let s = Toast.show({
        text: '图片上传中...',
        icon: <ActivityIndicator size='large' />,
        position: 'bottom'
      })

      Image.getSize(res, (width, height) => {

        let id = res.split('?')[1].split('&')[0].split('=')[1]

        Rpc.uploadFile(res, qiniu.token, { key : id }, (err, res)=>{

          if (err.total == err.loaded) {

            let imageUrl = qiniu.url+'/'+id

            if (width > 600) {
              imageUrl += '?imageMogr2/auto-orient/thumbnail/!600/quality/85'
            }

            self.webview.emit('add-photo', imageUrl);

            Toast.hide(s)
          } else {
            console.log('上传中:'+ err.total +' - '+ err.loaded);
          }
        })

      })

    }, function(){
      // 取消
      // console.log(err);
    })
  }

}

Editor.defaultProps = {
  initialContentJSON: '',
  transportContent: (data)=>{},
  placeholder: '请输入...'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:10,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#fff'
  },
  editor: {
    flex: 1
  },
  control: {
  },
  addPhoto: {
    height:40,
    justifyContent: 'center'
  },
  photoIcon: {
    height:25,
    width:25
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  })
)(Editor)
