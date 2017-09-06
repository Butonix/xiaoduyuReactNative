
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, Button, Image, ImagePickerIOS, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'

import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'

import KeyboardSpacer from 'react-native-keyboard-spacer'

import { WebView } from 'react-native-webview-messaging/WebView'
// import { Loading, EasyLoading } from 'react-native-easy-loading'
import { Toast } from 'teaset'

import ImagePicker from 'react-native-image-crop-picker'


import { getQiNiuToken } from '../../actions/qiniu'
import { uploadFile } from '../../common/upload-qiniu'

class Editor extends Component {

  constructor() {
    super()
    this.state = {
      qiniu: null,
      json: '',
      html: '',
      loading: false
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
    const { qiniu, loading } = this.state
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
                      {!loading ?
                        <TouchableOpacity onPress={this.addPhoto} style={styles.addPhoto}>
                          <Image source={require('./images/photo.png')} style={styles.photoIcon} />
                        </TouchableOpacity>
                        : <View style={styles.addPhoto}><Text>图片上传中...</Text></View>}
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

  uploadQiniu(image, callback) {

    const { qiniu } = this.state
    let id = image.localIdentifier

    Rpc.uploadFile(image.path, qiniu.token, { key : id }).then((response) => {

      if (response.responseText) {
        let res = JSON.parse(response.responseText)
        let imageUrl = qiniu.url+'/'+res.key
        callback(100, imageUrl)
      }

    }).then((responseText) => {
      // console.log(responseText);
    }).catch((error) => {
      // console.warn(error);
    })

  }

  addPhoto = () => {

    const self = this
    const { me } = this.props
    const { qiniu } = this.state

    ImagePicker.openPicker({
      compressImageMaxWidth: 900,
      compressImageMaxHeight: 900
    }).then(image => {

      self.setState({ loading: true })

      uploadFile({
        name: new Date().getTime() + '-' + me._id,
        imagePath: image.path,
        qiniu,
        callback: (progress, imageUrl)=>{

          // console.log(imageUrl);
          // console.log(progress);

          if (imageUrl) {
            // self.updateAvatar(imageUrl,()=>{
              self.setState({ loading: false })
              // self.getLoading().dismiss()
              self.webview.emit('add-photo', imageUrl)
            // })
          }

        }
      })

      /*
      self.setState({ loading: true })

        let id = image.localIdentifier

        Rpc.uploadFile(image.path, qiniu.token, { key : id }, (res, err)=>{

          if (res.total == res.loaded) {

            let imageUrl = qiniu.url+'/'+id

            setTimeout(()=>{
              self.webview.emit('add-photo', imageUrl)
            }, 1000)

            self.setState({ loading: '' })

          } else {
            self.setState({ loading: parseInt((res.loaded/res.total)*100)+'/100' })
          }

        })
      */
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
    return {
      me: getUserInfo(state)
    }
  },
  (dispatch, props) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  })
)(Editor)
