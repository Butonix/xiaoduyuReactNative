
import PostsList from '../../components/posts-list'
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, Button, AsyncStorage, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class TopicDetail extends Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: params.name,
      headerRight: (<View><Button onPress={()=>params.createPosts()} title={"创建帖子"} /></View>),
    }

  }

  constructor (props) {
    super(props)
    this.state = {
      content: ''
    }

    this.createPosts = this.createPosts.bind(this)
  }
  
  componentDidMount() {
    this.props.navigation.setParams({
      createPosts: this.createPosts
    })
  }

  createPosts() {
    const { navigate } = this.props.navigation
    const { id } = this.props.navigation.state.params
    navigate('WritePosts', { typeId: 1, topicId: id })
  }

  render() {

    const { id } = this.props.navigation.state.params

    const { navigation } = this.props

    return (<View style={styles.container}>
          <PostsList
            navigation={navigation}
            filters={{
              topic_id: id
            }}
            name={id}
            />
          </View>)
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default connect(state => ({
    state
  }),
  (dispatch) => ({
  })
)(TopicDetail);
