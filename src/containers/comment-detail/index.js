

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { getCommentById } from '../../reducers/comment'

import HTMLView from '../../components/html-view'
import CommentList from '../../components/comment-list'


class CommentDetail extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.title
  })

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

    const self = this
    const id = this.props.navigation.state.params.id
    const { loadCommentById } = this.props
    let { data } = this.props.comment

    if (!data || !data.length) {
      loadCommentById({ id })
    }

  }

  render() {

    let { data, loading } = this.props.comment

    let comment = data && data[0] ? data[0] : null

    if (!comment) {
      return (<Text>加载中...</Text>)
    }

    return (<ScrollView style={styles.container}>
        <View style={styles.comment}>
          <HTMLView html={comment.content_html} />
        </View>
        <View>
          <CommentList
            name={comment._id + '-reply'}
            filters={{ parent_id: comment._id, parent_exists: 1, per_page: 100 }}
            />
        </View>
      </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  comment: {
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  }
})

export default connect(
  (state, props) => {
    const id = props.navigation.state.params.id
    return {
      comment: getCommentById(state, id)
    }
  },
  (dispatch, props) => ({
    loadCommentById: bindActionCreators(loadCommentById, dispatch)
  })
)(CommentDetail);
