
import React, { Component } from 'react'
import { StyleSheet, Text, View, ListView, Image, refreshControl, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadNotifications } from '../../actions/notification';
import { getNotificationByName } from '../../reducers/notification'

import { DateDiff } from '../../common/date'

import CommentItem from '../../components/comment-item'
import HTMLView from '../../components/html-view'

import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'
import ListFooter from '../../components/ui/list-footer'
// import RefreshControl from '../../components/ui/refresh-control'
// import ListViewOnScroll from '../../common/list-view-onscroll'

class NotificationList extends Component {

  constructor (props) {
    super(props)

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      topics: ds.cloneWithRows([]),
      sourcePostsList: [],
      loadMore: false,
      more: true,
      isRefreshing: false,
      loading: false,
      filters: {
        lt_date: new Date().getTime(),
        per_page: 20
      },
      list: {
        loading: false,
        more: true
      }
    }
    this.goTo = this.goTo.bind(this)
    this.goToComment = this.goToComment.bind(this)
    this.loadList = this.loadList.bind(this)
    // this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderNotice = this.renderNotice.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.toPosts = this.toPosts.bind(this)
    this.toComment = this.toComment.bind(this)
    this.toReply = this.toReply.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentWillMount() {

    const { list } = this.props

    if (!list.data) {
      this.loadList()
    }

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { id: user._id })
  }

  toPosts(posts) {
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  toComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_trim, id: comment._id })
  }

  toReply(comment) {
    const { navigate } = this.props.navigation;
    // console.log(comment);
    navigate('WriteComment', {
      postsId: comment.posts_id._id,
      parentId: comment.parent_id ? comment.parent_id._id : null,
      replyId: comment._id
    })
  }

  loadList(callback, restart) {

    const { name, filters } = this.props

    this.props.loadNotifications({
      name,
      filters,
      callback,
      restart
    })
  }

  renderHeader() {
    // return (<View><Text></Text></View>)
  }

  onScroll(event) {

    const self = this
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (y + height >= contentHeight - 50 && !self.state.loading) {
      self.state.loading = true
      self.loadList(()=>{
        setTimeout(()=>{
          self.state.loading = false
        }, 2000)
      })
    }

  }

  renderFooter() {
    const { list } = this.props

    if (list.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} color={'#484848'} size={'small'} />
        </View>
      )
    } else if (!list.more) {
      return (
        <View>
          <Text>没有更多了</Text>
        </View>
      )
    }
  }

  renderNotice(notice) {

    const avatar = <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}} activeOpacity={0.8}><Image source={{ uri: 'https:'+notice.sender_id.avatar_url }} style={styles.avatar} /></TouchableOpacity>

    let content = null

    switch (notice.type) {

      case 'follow-you':
        content = (<View>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.gray}>关注了你</Text>
          </View>)
        break

      case 'follow-posts':
        content = (<View>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>关注了你的</Text>
              <Text onPress={()=>{this.toPosts(notice.posts_id)}}>{notice.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </View>)
        break

      case 'like-posts':
        content = (<View>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>赞了你的</Text>
              <Text onPress={()=>{this.toPosts(notice.posts_id)}}>{notice.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </View>)
        break

      case 'reply':
        content = (<View>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>回复了你的</Text>
            <Text onPress={()=>{this.toComment(notice.comment_id.parent_id)}}>
              {notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim}
            </Text>
            <Text style={styles.gray}>回复</Text>
          </Text>
          <TouchableOpacity onPress={()=>{this.toReply(notice.comment_id)}} activeOpacity={0.8}>
          <View style={styles.commentContent}>
            <Text style={styles.commentContentText}>{notice.comment_id.content_trim}</Text>
          </View>
          </TouchableOpacity>
        </View>)
        break

      case 'comment':

        content = (
          <View>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>

            <Text style={styles.title}>
              <Text style={styles.gray}>评论了你的</Text>
              <Text onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>{notice.comment_id.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>

          <TouchableOpacity onPress={()=>{this.toReply(notice.comment_id)}} activeOpacity={0.8}>
            <View style={styles.commentContent}>
              <Text style={styles.commentContentText}>{notice.comment_id.content_trim}</Text>
            </View>
          </TouchableOpacity>
        </View>)
        break

      case 'like-reply':
        content = (
          <View>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>赞了你的</Text>
            <Text onPress={()=>{this.toComment(notice.comment_id)}}>{notice.comment_id.content_trim}</Text>
            <Text style={styles.gray}>回复</Text>
          </Text>
        </View>)
        break

      case 'like-comment':
        content = (
        <View>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>赞了你的</Text>
            <Text onPress={()=>{this.toComment(notice.comment_id)}}>{notice.comment_id.content_trim}</Text>
            <Text style={styles.gray}>评论</Text>
          </Text>
        </View>)
        break

      // 新的回答通知
      case 'new-comment':
        content = (
          <View>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>评论了</Text>
            <Text onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>{notice.comment_id.posts_id.title}</Text>
            <Text style={styles.gray}>帖子</Text>
          </Text>
          <View>
            <Text>{notice.comment_id.content_trim}</Text>
          </View>
        </View>)
        break
    }

    if (content) {
      return (<View style={styles.item} key={notice._id}>{content}</View>)
    } else {
      return <View></View>
    }

  }

  render() {

    const self = this

    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有通知" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let itemlist = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={itemlist}
          renderRow={(item) => this.renderNotice(item)}
          // renderHeader={this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          // renderFooter={this.renderFooter}
          removeClippedSubviews={false}
          // refreshControl={<RefreshControl onRefresh={callback=>self.loadList(callback, true)} />}

          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#484848"
              title="加载中..."
              titleColor="#484848"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }

          onScroll={this.onScroll}
          // onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={50}
        />
    )
  }

  goTo(posts){

    const { navigate } = this.props.navigation;

    navigate('PostsDetail', { title: posts.title, id: posts._id })

    /*
    this.props.navigator.push({
      component: PostsDetail,
      title: '详情',
      id: id
      // rightButtonTitle: '收藏',
      // onRightButtonPress: function(){
      //   alert('点击了收藏按钮。');
      // }
    });
    */
  }

  goToComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_summary, id: comment._id })
  }

  _onScroll(event) {
    const self = this
    if (this.state.loadMore) return
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    // console.log('offsetY-->' + y);
    // console.log('height-->' + height);
    // console.log('contentHeight-->' + contentHeight);
    if (y+height>=contentHeight-20) {
      self.loadList()
    }
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.loadList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding:15,
    marginTop: 10,
  },
  space: {
    width:50,
    height:20,
    backgroundColor:'#333'
  },
  notice: {
    flexDirection:'row',
    flexWrap: 'wrap'
  },
  topicItem: {
    backgroundColor: '#fff',
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    flexDirection: 'row'
  },
  itemMain: {
    marginTop:10
  },
  images:{
    // flex: 1,
    width: 100,
    height: 100,
    marginTop:10,
    marginRight:10
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    fontWeight: 'bold'
  },
  loading: {
    height: 60
  },

  commentContent:{
    padding: 10,
    marginTop: 10,
    backgroundColor: '#efefef',
    borderRadius:5
  },

  commentContentText: {
    lineHeight: 20
  },

  nickname: {
    fontWeight: 'bold',
    marginRight: 10
  },

  head: {
    flexDirection:'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor:'#efefef'
  },
  gray: {
    color:'#909090'
  },

  title: {
    lineHeight: 20
  }

});


export default connect((state, props) => ({
    list: getNotificationByName(state, props.name)
  }),
  (dispatch) => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
  })
)(NotificationList)
