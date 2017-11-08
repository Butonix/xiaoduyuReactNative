import React from 'react'
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import HtmlView from '../html-view'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { like, unlike } from '../../actions/like'
// import LinkeButton from '../like-button'

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
// const CANCEL_INDEX = 0
// const DESTRUCTIVE_INDEX = 0
// const options = [ '取消', '回复', '赞', '编辑']

const S = global.styles

class CommentItem extends React.Component {

  constructor(props) {
    super(props)
    this.toPeople = this.toPeople.bind(this)
    this.reply = this.reply.bind(this)
    this.editComment = this.editComment.bind(this)
    this.showSheet = this.showSheet.bind(this)
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

  showSheet(key) {

    if (!key) return

    const { comment, handleUnlike, handleLike, me } = this.props
    const { navigate } = this.props.navigation

    if (key == 1) {

      let fn = comment.like ? handleUnlike : handleLike

      fn({
        data: {
          type: comment.parent_id ? 'reply' : 'comment',
          target_id: comment._id,
          mood: 1
        },
        callback: (res)=> {

          // console.log(res);
          if (res && !res.success) {
            Alert.alert('', res.error : '提交失败')
          }
        }
      })

      return
    }

    if (key == 2) return this.reply(comment)
    if (me && me._id == comment.user_id._id && key == 3) return this.editComment(comment)
    if (key == 3 || key == 4) return navigate('Report', { comment })
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
      canClick = true,
      me
    } = this.props

    let options = ['取消']
    options.push(comment.like ? '取消赞' : '赞')
    options.push('回复')
    if (displayEdit && me && me._id == comment.user_id._id) options.push('编辑')
    options.push('举报')

    // console.log(comment);

    let main = (<View style={[styles.item, subitem ? styles.subitem : null]}>

      <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }}>
        <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar} />
      </TouchableOpacity>

      <View style={styles.main}>

        <View style={styles.head}>
          <View style={styles.headLeft}>
            <Text style={styles.nickname} onPress={()=>{this.toPeople(comment.user_id)}}>
              {comment.user_id.nickname}
            </Text>

            {comment.reply_id ? <Text style={[S['m-l-5'], S['f-s-12'], S['black-20']]}> 回复了 </Text> : null}
            {comment.reply_id ? <Text style={S['bold']}>{comment.reply_id.user_id.nickname}</Text> : null}

            {displayCreateAt ? <Text style={[S['m-l-10'], S['f-s-12'], S['black-20']]}>{comment._create_at}</Text> : null}
            {comment.reply_count ? <Text style={[S['m-l-10'], S['f-s-12'], S['black-20']]}>{comment.reply_count + '个回复'}</Text> : null}
            {comment.like_count ? <Text style={[S['m-l-10'], S['f-s-12'], S['black-20']]}>{comment.like_count + '个赞'}</Text> : null}

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

        {/*
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
          </View>


        </View>
        */}


      </View>

    </View>)

    if (canClick) {
      main = <TouchableOpacity onPress={()=>{ this.ActionSheet.show() }}>
        {main}
      </TouchableOpacity>
    }

    return (<View>

        {main}

        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={options}
          cancelButtonIndex={0}
          destructiveButtonIndex={0}
          onPress={this.showSheet}
        />

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
    // paddingRight: 15
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
    loadCommentById: bindActionCreators(loadCommentById, dispatch),
    handleLike: bindActionCreators(like, dispatch),
    handleUnlike: bindActionCreators(unlike, dispatch)
  })
)(CommentItem)
