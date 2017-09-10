import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Button, TextInput, Alert } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { addPosts, updatePostsById } from '../../actions/posts'

import Editor from '../../components/editor'

import { Toast, ModalIndicator } from 'teaset'

class WritePosts extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: params.topic.name,
      headerRight: (<View><Button onPress={()=>params.submit()} title={"发布"} /></View>)
    }

  }

  constructor (props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: ''
    }

    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submit: this.submit
    })
  }

  submit() {

    const { addPosts, updatePostsById, navigation } = this.props
    const { navigate } = navigation
    const { topic, posts } = navigation.state.params

    const { title, contentJSON, contentHTML } = this.state

    let loading = ModalIndicator.show('');

    if (posts) {
      // 更新
      updatePostsById({
        id: posts._id,
        title: title,
        content: contentJSON,
        contentHTML: contentHTML,
        topicId: topic._id,
        // device: 1,
        type: 1,
        callback: (res)=>{
          ModalIndicator.hide(loading)
          if (res && res.success) {
            navigation.goBack()
          } else {
            Alert.alert('', res && res.error ? res.error : '更新失败')
          }
        }
      })
    } else {
      // 添加
      addPosts({
        title: title,
        detail: contentJSON,
        detailHTML: contentHTML,
        topicId: topic._id,
        device: 1,
        type: 1,
        callback: (res)=>{
          ModalIndicator.hide(loading)
          if (res && res.success) {
            let posts = res.data
            navigate('PostsDetail', { title: posts.title, id: posts._id })
          } else {
            Alert.alert('', res && res.error ? res.error : '发布失败')
          }
        }
      })
    }
  }

  render() {

    const self = this
    const { topic, posts } = this.props.navigation.state.params

    return (<View style={styles.container}>
      <View>
        <TextInput
          style={styles.title}
          onChangeText={(title) => this.setState({title})}
          placeholder='请输入标题'
          defaultValue={posts ? posts.title : ''}
          autoFocus={true}
          />
      </View>
      <View style={{ flex:1 }}>
        <Editor
          transportContent={(data)=>{
            self.state.contentJSON = data.json
            self.state.contentHTML = data.html
          }}
          initialContentJSON={posts ? posts.content : null}
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
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    addPosts: bindActionCreators(addPosts, dispatch),
    updatePostsById: bindActionCreators(updatePostsById, dispatch)
  })
)(WritePosts)
