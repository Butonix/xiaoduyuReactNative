import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, WebView, ImagePickerIOS } from 'react-native'

// import { NavigationActions } from 'react-navigation'
import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu'
// Conf.ACCESS_KEY = 'V7Tt-TvFyxpd0r6w0iyg6L4PkZOv0oRUsB1xymfm'
// Conf.SECRET_KEY = 'CIK0hDp3gPBBxaEA_gHyWiqVgmDldoG4a_yDg4iE'

// const imagePicker from 'react-native-imagepicker'
// const imagePicker = require('react-native-imagepicker');

// console.log(ImagePickerIOS.openSelectDialog);
// console.log(imagePicker.default.open);
// console.log(Rpc.uploadFile);

//
//


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signin } from '../../actions/sign'
import { sendEmailCaptcha, resetPasswordByCaptcha } from '../../actions/account'
import { getQiNiuToken } from '../../actions/qiniu'

import gStyles from '../../styles'

import CaptchaButton from '../../components/captcha-button'

class Forgot extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Draft.js'
  })

  constructor (props) {
    super(props)
    this.state = {
      qiniu: null,
      image: ''
    }
    this.picker = this.picker.bind(this)
  }

  componentWillMount() {

    const self = this

    this.props.getQiNiuToken({
      callback: (res)=>{



        if (res) {

          self.setState({
            qiniu: res
          })

        }
        // console.log(res);
      }
    })
  }

  picker() {

    const self = this
    const { qiniu } = this.state

    ImagePickerIOS.openSelectDialog({}, function(res){

      Image.getSize(res, (width, height) => {

        let id = res.split('?')[1].split('&')[0].split('=')[1]

        Rpc.uploadFile(res, qiniu.token, { key : id }, (err, res)=>{
          if (err.total == err.loaded) {

            let imageUrl = 'https:'+qiniu.url+'/'+id
            
            if (width > 600) {
              imageUrl += '?imageMogr2/thumbnail/!600/quality/85'
            }

            self.setState({ image: imageUrl })

            console.log(imageUrl);
          } else {
            console.log('上传中:'+ err.total +' - '+ err.loaded);
          }
        })

      })

    }, function(){
    })

  }

  render() {

    const { qiniu, image } = this.state

    return (<View style={styles.container}>
      {image ?
        <Image source={{uri:image}} style={styles.image}  /> : null}
      {qiniu ?
        <TouchableOpacity onPress={this.picker}>
          <Text>upload images</Text>
        </TouchableOpacity>
        : null}

      <WebView source={{uri: 'https://www.xiaoduyu.com'}} />
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
  itemLeft: {
    flex: 1
  },
  image: {
    width: 150,
    height: 150
  }
})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  })
)(Forgot)
