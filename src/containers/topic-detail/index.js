
import PostsList from '../../components/posts-list'
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, Button, AsyncStorage, TouchableOpacity } from 'react-native'
import WriteIcon from '../../components/ui/icon/write'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class TopicDetail extends Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: params.title,
      headerRight: (<TouchableOpacity onPress={()=>params.createPosts()}><WriteIcon /></TouchableOpacity>)
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
    const { topic } = this.props.navigation.state.params
    navigate('WritePosts', { topic })
  }

  render() {
    
    const { topic } = this.props.navigation.state.params

    const { navigation } = this.props

    return (<View style={styles.container}>
          <PostsList
            navigation={navigation}
            filters={{
              topic_id: topic._id
            }}
            name={topic._id}
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
