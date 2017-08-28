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
  TouchableOpacity,
  Alert
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { addPosts } from '../../actions/posts'
import { getWritePosts } from '../../reducers/write-posts'
import { setTopic } from '../../actions/write-posts'


import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

import Editor from '../../components/editor'

class WritePosts extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

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
      content: '',
      contentJSON: '',
      contentHTML: ''
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
    const { addPosts, posts } = this.props
    const { title, contentJSON, contentHTML } = this.state
    const { navigate } = this.props.navigation

    addPosts({
      title: title,
      detail: contentJSON,
      detailHTML: contentHTML,
      topicId: posts.topic._id,
      device: 1,
      type: 1,
      callback: (res)=>{
        if (res && res.success) {
          let posts = res.data
          navigate('PostsDetail', { title: posts.title, id: posts._id })
        } else {
          Alert.alert('', res && res.error ? res.error : '发布失败')
        }
      }
    })

  }

  render() {

    const self = this
    const { me } = this.props
    const { navigate } = this.props.navigation
    const { posts } = this.props

    return (<View style={styles.container}>
      <View>
        <TouchableOpacity onPress={()=>{ navigate('ChooseTopic') }} style={styles.title}>
          <View><Text>{posts.topic ? posts.topic.name : '请选择一个话题'}</Text></View>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.title}
          onChangeText={(title) => this.setState({title})}
          placeholder='请输入标题'
          />
      </View>
      <View style={{ flex:1 }}>
        <Editor
          transportContent={(data)=>{
            self.state.contentJSON = data.json
            self.state.contentHTML = data.html
          }}
        />
      </View>
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  title: {
    height: 40,
    justifyContent: 'center',
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
    addPosts: bindActionCreators(addPosts, dispatch),
    setTopic: bindActionCreators(setTopic, dispatch)
  })
)(WritePosts);
