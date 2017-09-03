

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { getCommentById } from '../../reducers/comment'

import HTMLView from '../../components/html-view'
import CommentList from '../../components/comment-list'
import BottomBar from '../../components/bottom-bar'

class CommentDetail extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.title
  })

  constructor (props) {
    super(props)
    this.state = {}
    this.toPeople = this.toPeople.bind(this)
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

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: user.nickname, id: user._id })
  }

  render() {

    let { data, loading } = this.props.comment

    let comment = data && data[0] ? data[0] : null

    if (!comment) {
      return (<Text>加载中...</Text>)
    }

    return (<View style={styles.container}>
      <ScrollView style={styles.main}>

        <View style={styles.itemHead}>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(comment.user_id)}}>
              <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar}  />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(comment.user_id)}}>
              <Text>{comment.user_id.nickname}</Text>
            </TouchableOpacity>
            <View>
              <Text>{comment._create_at}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.comment}>
          <HTMLView html={comment.content_html} />
        </View>

        <View>
          <CommentList
            {...this.props}
            name={comment._id + '-reply'}
            filters={{ parent_id: comment._id, parent_exists: 1, per_page: 100 }}
            displayReply={true}
            displayLike={true}
            displayCreateAt={true}
            />
        </View>
      </ScrollView>
      <BottomBar {...this.props} comment={comment} />
      </View>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  main: {
    flex: 1
  },
  comment: {
    padding:15,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    padding:15,
    paddingBottom:0,
    flexDirection: 'row'
  },
  head: {
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
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
