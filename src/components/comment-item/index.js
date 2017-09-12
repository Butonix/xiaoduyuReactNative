import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import HtmlView from '../html-view'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'

class CommentItem extends React.Component {

  constructor(props) {
    super(props)
    this.toPeople = this.toPeople.bind(this)
    this.reply = this.reply.bind(this)
    this.editComment = this.editComment.bind(this)
  }

  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  reply(comment) {
    const { navigate } = this.props.navigation;
    navigate('WriteComment', {
      postsId: comment.posts_id._id,
      parentId: comment.parent_id || comment._id,
      replyId: comment._id
    })
  }

  editComment(comment) {

    const { navigate } = this.props.navigation;
    const { loadCommentById } = this.props

    loadCommentById({
      id: comment._id,
      callback: (res)=>{
        if (res) {
          navigate('WriteComment', { comment: res })
        }
      }
    })
  }

  render() {

    const {
      comment,
      displayLike = false,
      displayReply = false,
      subitem = false,
      displayCreateAt = false,
      me
    } = this.props

    return (<View style={[styles.item, subitem ? styles.subitem : null]}>

        <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }}>
          <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.main}>

          <View style={styles.head}>
            <View style={styles.headLeft}>
              <Text style={styles.nickname} onPress={()=>{this.toPeople(comment.user_id)}}>
                {comment.user_id.nickname}
              </Text>
              <Text style={styles.other}>
                {comment.reply_count ? comment.reply_count + '个回复' : null} {comment.like_count ? comment.like_count+'个赞' : null} {displayCreateAt ? comment._create_at : null}
              </Text>
            </View>
            <View style={styles.headRight}>
              {displayLike ? <Text style={styles.like}>赞</Text> : null}
              {displayReply ? <TouchableOpacity onPress={()=>{this.reply(comment)}} style={styles.like}><Text>回复</Text></TouchableOpacity> : null}
              {me && me._id == comment.user_id._id ? <TouchableOpacity onPress={()=>{this.editComment(comment)}}><Text>编辑</Text></TouchableOpacity> : null}
            </View>
          </View>
          
          <View style={styles.content}>
          {comment.content_summary ?
            <Text>{comment.content_summary}</Text> :
            <HtmlView html={comment.content_html} imgOffset={80} />}
          </View>

        </View>

      </View>)
  }
}

// export default CommentItem

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    padding: 15
  },
  avatar:{
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight:10
  },
  main: {
    flex: 1
  },
  head:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headLeft: {
    flexDirection: 'row'
  },
  nickname: {
    fontWeight: 'bold',
    marginRight: 10
  },
  other: {
    color: 'rgb(138, 138, 138)',
    fontSize: 12
  },
  headRight: {
    flexDirection: 'row'
  },
  like: {
    marginRight:15
  },
  subitem: {
    paddingLeft: 0
  },
  content: {
    flex:1,
    paddingRight: 15
  }
})

export default connect((state, props) => {
    return {
    }
  },
  (dispatch, props) => ({
    loadCommentById: bindActionCreators(loadCommentById, dispatch)
  })
)(CommentItem)
