import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import HtmlView from '../html-view'

class CommentItem extends React.Component {

  constructor(props) {
    super(props)
    this.toPeople = this.toPeople.bind(this)
  }

  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { id: people._id })
  }

  render() {
    
    const { comment } = this.props

    return (<View style={styles.item}>
        <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }}>
          <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.main}>
          <View style={styles.head}>
            <Text onPress={()=>{this.toPeople(comment.user_id)}}>
              {comment.user_id.nickname}
            </Text>
            <Text>
              {comment.reply_count ? comment.reply_count + '个回复' : null} {comment.like_count ? comment.like_count+'个赞' : null}
            </Text>
          </View>

          {comment.content_summary ?
            <Text>{comment.content_summary}</Text>
            : null}

          {!comment.content_summary && comment.content_html ?
            <HtmlView html={comment.content_html} />
            : null}

        </View>
      </View>)
  }
}

export default CommentItem

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    padding: 20
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
    flexDirection: 'row'
  }
})
