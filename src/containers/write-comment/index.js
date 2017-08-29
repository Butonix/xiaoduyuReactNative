import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  NavigatorIOS,
  ScrollView,
  refreshControl,
  RefreshControl,
  Navigator,
  Button,
  TouchableWithoutFeedback,
  TextInput,
  Alert
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUserInfo } from '../../reducers/user'
import { addComment } from '../../actions/comment'

import Editor from '../../components/editor'



// import KeyboardSpacer from 'react-native-keyboard-spacer'

// import Dimensions from 'Dimensions'
// const screenWidth = Dimensions.get('window').width
// const screenHeight = Dimensions.get('window').height

class WriteComment extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerLeft: (<View><Button onPress={()=>params.cancel()} title={"取消"} /></View>),
      title: '写评论',
      headerRight: (<View><Button onPress={()=>params.submit()} title={"发布"} /></View>),
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

    const { postsId, parentId, replyId } = this.props.navigation.state.params
    const { addComment } = this.props
    const { contentJSON, contentHTML } = this.state

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

    addComment({
      data,
      callback: (res) => {
        console.log(res);
      }
    })
  }

  render() {

    const self = this
    // const { me } = this.props

    return (<View style={styles.container}>
      <Editor
        transportContent={(data)=>{
          self.state.contentJSON = data.json
          self.state.contentHTML = data.html
        }}
      />
    </View>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect(state => ({
    // me: getUserInfo(state)
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch)
  })
)(WriteComment);
