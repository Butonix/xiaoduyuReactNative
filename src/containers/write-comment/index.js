import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'

import { Toast, ModalIndicator } from 'teaset'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addComment } from '../../actions/comment'

import Editor from '../../components/editor'

class WriteComment extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerLeft: (<View><Button onPress={()=>params.cancel()} title={"取消"} /></View>),
      title: '写评论',
      headerRight: (<View><Button onPress={()=>params.submit()} title={"提交"} /></View>),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: ''
    }
    this.submit = this.submit.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submit: this.submit,
      cancel: this.cancel
    })
  }

  cancel() {
    const { navigation } = this.props
    navigation.goBack()
  }

  submit() {

    const self = this
    const { postsId, parentId, replyId } = this.props.navigation.state.params
    const { addComment, navigation } = this.props
    const { contentJSON, contentHTML } = this.state

    if (contentJSON == '' || contentHTML == '') {

      Toast.show({
        text: '请输入内容',
        icon: 'info',
        position: 'center',
        duration: 1000
      })

      return
    }

    let data = {
      posts_id: postsId,
      device_id : 1,
      content : contentJSON,
      content_html: contentHTML
    }

    if (parentId) data.parent_id = parentId
    if (replyId) data.reply_id = replyId

    let s = ModalIndicator.show(`提交中...`);

    addComment({
      data,
      callback: (res) => {

        ModalIndicator.hide(s)

        if (res.success) {
          Toast.show({
            text: '提交成功',
            icon: 'success',
            position: 'center',
            duration: 1000
          })
          navigation.goBack()
        } else {

          Toast.show({
            text: res.error || '提交失败',
            icon: 'fail',
            position: 'center',
            duration: 1000
          })

        }

      }
    })
  }

  render() {
    const self = this

    return (<View style={{flex:1}}>
      <Editor
        transportContent={(data)=>{
          self.state.contentJSON = data.json
          self.state.contentHTML = data.html
        }}
      />
    </View>)
  }
}


export default connect(state => ({
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch)
  })
)(WriteComment)
