import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native'

// import { Toast, ModalIndicator } from 'teaset'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addComment, updateComment } from '../../actions/comment'

import Editor from '../../components/editor'
import Wait from '../../components/ui/wait'

class WriteComment extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      // headerLeft: (<View><Button onPress={()=>params.cancel()} title={"取消"} /></View>),
      title: params.replyId ? '编写回复' : '编写评论',
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
    // this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submit: this.submit
      // cancel: this.cancel
    })
  }

  // cancel() {
  //   const { navigation } = this.props
  //   navigation.goBack()
  // }

  submit() {

    const self = this
    const { postsId, parentId, replyId } = this.props.navigation.state.params
    const { addComment, updateComment, navigation } = this.props
    const { contentJSON, contentHTML } = this.state

    const { comment } = self.props.navigation.state.params

    if (contentJSON == '' || contentHTML == '') {
      Alert.alert('', '请输入内容')
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

    // let s = ModalIndicator.show(`提交中...`);
    self.setState({ visible: true })

    if (comment) {
      // 更新
      updateComment({
        id: comment._id,
        contentJSON: contentJSON,
        contentHTML: contentHTML,
        callback: (res)=>{
          // ModalIndicator.hide(s)
          self.setState({ visible: false })
          if (res && res.success) {
            navigation.goBack()
          } else {
            Alert.alert('', res && res.error ? res.error : '更新失败')
          }

        }
      })
    } else {

      addComment({
        data,
        callback: (res) => {

          // ModalIndicator.hide(s)
          self.setState({ visible: false })

          if (res.success) {
            // Toast.show({
            //   text: '提交成功',
            //   icon: 'success',
            //   position: 'center',
            //   duration: 1000
            // })
            navigation.goBack()
          } else {
            Alert.alert('', res.error || '提交失败')
            // Toast.show({
            //   text: res.error || '提交失败',
            //   icon: 'fail',
            //   position: 'center',
            //   duration: 1000
            // })
          }

        }
      })
    }


  }

  render() {
    const self = this

    const { comment } = self.props.navigation.state.params

    return (<View style={{flex:1}}>
      <Editor
        transportContent={(data)=>{
          self.state.contentJSON = data.json
          self.state.contentHTML = data.html
        }}
        initialContentJSON={comment ? comment.content : null}
      />
      {this.state.visible ? <Wait /> : null}
    </View>)
  }
}


export default connect(state => ({
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  })
)(WriteComment)
