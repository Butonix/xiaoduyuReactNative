import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import HtmlView from '../html-view'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'

const S = global.styles

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

    const self = this
    const {
      comment,
      displayLike = false,
      displayReply = false,
      subitem = false,
      displayCreateAt = false,
      displayEdit = true,
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

              {/*
              <Text style={styles.other}>
                {comment.reply_count ? comment.reply_count + '个回复' : null} {comment.like_count ? comment.like_count+'个赞' : null} {displayCreateAt ? comment._create_at : null}
              </Text>
              */}
            </View>
            {/*
            <View style={styles.headRight}>
              {displayLike ? <Text style={styles.like}>赞</Text> : null}
              {displayReply ? <TouchableOpacity onPress={()=>{this.reply(comment)}} style={styles.like}><Text>回复</Text></TouchableOpacity> : null}
              {displayEdit && me && me._id == comment.user_id._id ? <TouchableOpacity onPress={()=>{self.editComment(comment)}}><Text>编辑</Text></TouchableOpacity> : null}
            </View>
            */}
          </View>

          <View style={styles.content}>
            {comment.content_summary ?
              <Text style={styles.contentText}>{comment.content_summary}</Text> :
              <HtmlView html={comment.content_html} imgOffset={80} />}
          </View>

          <View style={{'justifyContent': 'space-between', 'flexDirection': 'row'}}>

            <View style={[S['f-d-r'], S['m-t-10']]}>
              {displayCreateAt ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40']]}>{comment._create_at}</Text> : null}
              {comment.reply_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40']]}>{comment.reply_count + '个回复'}</Text> : null}
              {comment.like_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40']]}>{comment.like_count + '个赞'}</Text> : null}
            </View>

            <View style={[S['f-d-r'], S['m-t-10']]}>
              {displayLike ? <Image source={comment.like ? require('./images/like-red.png') : require('./images/like.png')} style={[{width:16,height:16}, S['m-l-15']]} resizeMode="cover" /> : null}
              {displayReply ?
                <TouchableOpacity onPress={()=>{this.reply(comment)}}>
                  <Image source={require('./images/reply.png')} style={[{width:16,height:16}, S['m-l-15']]} resizeMode="cover" />
                </TouchableOpacity>
                : null}
              {displayEdit && me && me._id == comment.user_id._id ?
                <TouchableOpacity onPress={()=>{self.editComment(comment)}}>
                  <Image source={require('./images/edit.png')} style={[{width:16,height:16}, S['m-l-15']]} resizeMode="cover" />
                </TouchableOpacity>
                : null}
              {/*displayReply ? <TouchableOpacity onPress={()=>{this.reply(comment)}} style={styles.like}><Text>回复</Text></TouchableOpacity> : null*/}
              {/*displayEdit && me && me._id == comment.user_id._id ? <TouchableOpacity onPress={()=>{self.editComment(comment)}}><Text>编辑</Text></TouchableOpacity> : null*/}
            </View>

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
    borderTopWidth: 1,
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
    justifyContent: 'space-between',
    marginBottom:5
  },
  headLeft: {
    flexDirection: 'row'
  },
  nickname: {
    fontWeight: 'bold'
    // marginRight: 10
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
  },
  contentText: {
    lineHeight: 18
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
