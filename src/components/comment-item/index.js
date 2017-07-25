import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import HtmlView from '../html-view'

class CommentItem extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    const { comment } = this.props

    return (<View style={styles.item}>
        <View>
          <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar} />
        </View>
        <View style={styles.main}>
          <Text>
            {comment.user_id.nickname} {comment.reply_count ? comment.reply_count + '个回复' : null} {comment.like_count ? comment.like_count+'个赞' : null}
          </Text>

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
  }
})
