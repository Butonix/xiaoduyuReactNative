import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Button, Image, TextInput, TouchableOpacity } from 'react-native'

// import { NavigationActions } from 'react-navigation'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { resetAvatar, loadUserInfo } from '../../actions/user'
import { ListItem } from '../../components/ui'

import { getQiNiuToken } from '../../actions/qiniu'
import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'
import ImagePicker from 'react-native-image-crop-picker'

// import gStyles from '../../styles'

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 0
const options = [ '取消', '拍照', '从手机相册选中']
const title = ''

class ResetAvatar extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    let option = { title: '头像' }

    if (params.showActionSheet) {
      option.headerRight = (<View><Button onPress={()=>params.showActionSheet()} title={"修改"} /></View>)
    }

    return option
  }

  constructor (props) {
    super(props)
    this.state = {
      qiniu: null,
      submitting: false
    }
    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.uploadQiniu = this.uploadQiniu.bind(this)
    this.updateAvatar = this.updateAvatar.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      showActionSheet: this.showActionSheet
    })
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

  updateAvatar(imageUrl) {

    const { resetAvatar, loadUserInfo } = this.props

    resetAvatar({
      avatar: imageUrl,
      callback: (res) => {

        if (!res.success) {
          Alert.alert('', res.error)
        } else {

          loadUserInfo({
            callback: ()=>{
            }
          })

        }
      }
    })

  }

  showActionSheet() {
    this.ActionSheet.show()
  }


  uploadQiniu(image, callback) {

    const { qiniu } = this.state

    let id = image.localIdentifier

    Rpc.uploadFile(image.path, qiniu.token, { key : id }, (res, err)=>{

      if (res.total == res.loaded) {

        let imageUrl = qiniu.url+'/'+id

        setTimeout(()=>{
          callback(100, imageUrl)
        }, 1000)
      } else {
        callback(parseInt((res.loaded/res.total)*100))
      }

    })

  }

  handlePress(i) {

    const self = this
    const { me } = this.props

    if (!i) {
    } else if (i == 1) {

      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true
      }).then(image => {

        image.localIdentifier = new Date().getTime() + '-' + me._id

        self.uploadQiniu(image, (progress, imageUrl)=>{
          if (imageUrl) self.updateAvatar(imageUrl)
        })
      })

    } else if (i == 2) {

      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true
      }).then(image => {
        self.uploadQiniu(image, (progress, imageUrl)=>{
          if (imageUrl) self.updateAvatar(imageUrl)
        })
      })

    }
  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    let avatar = 'https:' + me.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')

    return (<View style={styles.container}>
              <Image source={{uri: avatar}} style={styles.avatar} />

              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={title}
                options={options}
                cancelButtonIndex={CANCEL_INDEX}
                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                onPress={this.handlePress}
              />

          </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#000'
  },
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 150
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch),
    resetAvatar: bindActionCreators(resetAvatar, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetAvatar);
