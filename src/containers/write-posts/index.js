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
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { addComment } from '../../actions/comment'
import { getWritePosts } from '../../reducers/write-posts'
import { setTopic } from '../../actions/write-posts'


class WritePosts extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    console.log(params);

    let title = '说说'
    if (params.typeId == 2) {
      title = '提问'
    } else if (params.typeId == 3) {
      title = '写文章'
    }

    return {
      headerLeft: (<View><Button onPress={()=>params.cancel()} title={"取消"} /></View>),
      title: title,
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

  componentWillMount() {
    this.props.setTopic({ topic: null })
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

    // const { postsId, parentId, replyId } = this.props.navigation.state.params
    // const { addComment } = this.props
    // const { content } = this.state
    //
    // let data = {
    //   posts_id: postsId,
    //   device_id : 1,
    //   content : content,
    //   content_html: content,
    // }
    // if (parentId) data.parent_id = parentId
    // if (replyId) data.reply_id = replyId
    //
    // addComment({
    //   data,
    //   callback: (res) => {
    //     console.log(res);
    //   }
    // })

    // console.log('提交');
  }

  render() {

    const { me } = this.props
    const { navigate } = this.props.navigation
    const { posts } = this.props

    return (<View>
      <TouchableOpacity onPress={()=>{ navigate('ChooseTopic') }} style={styles.title}>
        <View><Text>{posts.topic ? posts.topic.name : '请选择一个话题'}</Text></View>
      </TouchableOpacity>
      <View>
        <TextInput
          style={styles.title}
          onChangeText={(title) => this.setState({title})}
          placeholder='请输入标题'
          />
      </View>
      <View>
        <TextInput
          style={styles.content}
          multiline={true}
          onChangeText={(content) => this.setState({content})}
          placeholder='请输入评论内容'
          />
      </View>
    </View>)
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    height: 40,
    justifyContent: 'center',
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  content: {
    height: 300,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: '#fff'
  }
});

export default connect(state => ({
    me: getUserInfo(state),
    posts: getWritePosts(state)
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch),
    setTopic: bindActionCreators(setTopic, dispatch)
  })
)(WritePosts);
