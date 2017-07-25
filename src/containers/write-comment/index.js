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
  TextInput
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { addComment } from '../../actions/comment'

class WriteComment extends React.Component {


  // static navigationOptions = {
  //   headerTitle: '写评论',
  //   header: ({ state }) => ({
  //       right: <Button title={"Save"} onPress={() => {state.params.submit()}} />
  //   })
  // }

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
      content: ''
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
    const { content } = this.state

    let data = {
      posts_id: postsId,
      device_id : 1,
      content : content,
      content_html: content,
    }
    if (parentId) data.parent_id = parentId
    if (replyId) data.reply_id = replyId

    addComment({
      data,
      callback: (res) => {
        console.log(res);
      }
    })

    // console.log('提交');
  }

  render() {

    const { me } = this.props

    return (<View>
      <TextInput
        style={styles.input}
        multiline={true}
        onChangeText={(content) => this.setState({content})}
        placeholder='请输入评论内容'
        />
    </View>)
  }
}


const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  input: {
    height: 300,
    borderColor: '#efefef',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff'
  }
});

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch)
  })
)(WriteComment);
