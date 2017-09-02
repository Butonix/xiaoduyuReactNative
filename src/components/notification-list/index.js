/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  NavigatorIOS,
  ScrollView,
  refreshControl,
  RefreshControl,
  Navigator,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadNotifications } from '../../actions/notification';
import { getNotificationByName } from '../../reducers/notification'

import { DateDiff } from '../../common/date'

import CommentItem from '../../components/comment-item'
import HTMLView from '../../components/html-view'

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
    this.test = this.test.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderNotice = this.renderNotice.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.toPosts = this.toPosts.bind(this)
    this.toComment = this.toComment.bind(this)
    this.toReply = this.toReply.bind(this)
  }

  test() {
    console.log('214')
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
    return (<View><Text></Text></View>)
  }

  renderFooter() {
    const { list } = this.props

    if (list.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator animating={true} color={'#484848'} size={'small'} />
        </View>
      )
    }
  }

  renderNotice(notice) {
    const avatar = <Image source={{ uri: 'https:'+notice.sender_id.avatar_url }} style={styles.avatar} />

    switch (notice.type) {

      case 'follow-you':
        content = (<View>
            <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            </TouchableOpacity>
            <Text style={styles.gray}>关注了你</Text>
          </View>)
        break

      case 'follow-posts':
        content = (<TouchableOpacity onPress={()=>{this.toPosts(notice.posts_id)}}><View>
            <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            </TouchableOpacity>
            <Text>
              <Text style={styles.gray}>关注了你的</Text>
              <Text>{notice.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </View></TouchableOpacity>)
        break

      case 'like-posts':
        content = (<TouchableOpacity onPress={()=>{this.toPosts(notice.posts_id)}}>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
            <View style={styles.head}>
              {avatar}
              <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
              <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
            </View>
            </TouchableOpacity>
            <Text>
              <Text style={styles.gray}>赞了你的</Text>
              <Text>{notice.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </View>
          </TouchableOpacity>)
        break

      case 'reply':
        content = (<View>
          <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.toComment(notice.comment_id.parent_id)}}>
          <Text>
            <Text style={styles.gray}>回复了你的</Text>
            <Text>{notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim}</Text>
            <Text style={styles.gray}>回复</Text>
          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.toReply(notice.comment_id)}}>
          <View style={styles.commentContent}>
            <Text>{notice.comment_id.content_trim}</Text>
          </View>
          </TouchableOpacity>
        </View>)
        break

      case 'comment':
        content = (<TouchableOpacity onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>
          <View>
          <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          </TouchableOpacity>

            <Text>
              <Text style={styles.gray}>评论了你的</Text>
              <Text>{notice.comment_id.posts_id.title}</Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>

          <TouchableOpacity onPress={()=>{this.toReply(notice.comment_id)}}>
            <View>
              <Text>{notice.comment_id.content}</Text>
            </View>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>)
        break

      case 'like-reply':
        content = (<TouchableOpacity onPress={()=>{this.toComment(notice.comment_id)}}>
          <View>
          <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          </TouchableOpacity>
          <Text>
            <Text style={styles.gray}>赞了你的</Text>
            <Text>{notice.comment_id.content_trim}</Text>
            <Text style={styles.gray}>回复</Text>
          </Text>
        </View>
        </TouchableOpacity>)
        break

      case 'like-comment':
        content = (<TouchableOpacity onPress={()=>{this.toComment(notice.comment_id)}}>
        <View>
          <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          </TouchableOpacity>
          <Text>
            <Text style={styles.gray}>赞了你的</Text>
            <Text>{notice.comment_id.content_trim}</Text>
            <Text style={styles.gray}>评论</Text>
          </Text>
        </View>
        </TouchableOpacity>)
        break

      // 新的回答通知
      case 'new-comment':
        content = (<TouchableOpacity onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>
          <View>
          <TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}}>
          <View style={styles.head}>
            {avatar}
            <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
            <Text style={styles.gray}>{DateDiff(notice.create_at)}</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}>
          <Text>
            <Text style={styles.gray}>评论了</Text>
            <Text>{notice.comment_id.posts_id.title}</Text>
            <Text style={styles.gray}>帖子</Text>
          </Text>
          </TouchableOpacity>
          <View>
            <Text>{notice.comment_id.content_trim}</Text>
          </View>
        </View>
        </TouchableOpacity>)
        break
    }

    if (content) {
      return (<View key={notice._id}>{content}</View>)
    }

  }

  render() {

    const self = this
    // let list = getPostListByName(this.props.state, 'test')

    const { list } = this.props

    // console.log(list);

    if (!list.data) {
      return (<View></View>)
    }

    // console.log(list);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let itemlist = ds.cloneWithRows(list.data || [])

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={itemlist}
          renderRow={(item) => (<View style={styles.item}>
            {this.renderNotice(item)}
          </View>)}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          removeClippedSubviews={false}
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
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={50}
        />
      </View>
    );
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
    padding:10,
    marginBottom: 10,
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
    backgroundColor: '#efefef'
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
  }
});


export default connect((state, props) => ({
    // state: state，
    list: getNotificationByName(state, props.name)
  }),
  (dispatch) => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
  })
)(NotificationList);

// export default PostsList
