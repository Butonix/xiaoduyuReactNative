
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

import { loadPostsList } from '../../actions/posts';
import { getPostListByName } from '../../reducers/posts'

import styles from './style'
import CommentItem from '../../components/comment-item'

class PostsList extends Component {

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
    this.loadPostsList = this.loadPostsList.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  toPeople(people) {
    // console.log(people);
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { id: people._id })
  }

  // onLoadEnd(e) {
  //   if (!e.nativeEvent.size) return;
  //   const { width, height } = e.nativeEvent.size;
  //   this.setState({
  //     width,
  //     height,
  //   });
  // }

  componentWillMount() {

    // const { posts } = this.props.state
    const { list } = this.props

    // console.log(list);
    // console.log('进入了帖子列表组件');

    if (!list.data) {
      this.loadPostsList()
    }

  }

  loadPostsList(callback, restart) {

    const { name, filters } = this.props

    // let list = getPostListByName(this.props.state, 'test')
    // filters: {
    //   include_comments: 1,
    //   comments_sort: 'create_at:-1'
    // },
    this.props.loadPostsList({
      name,
      filters,
      callback,
      restart
    })
  }

  renderHeader() {
    return (<View></View>)
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

  render() {

    const self = this
    // let list = getPostListByName(this.props.state, 'test')

    const { list } = this.props

    // console.log(list);

    if (!list.data) {
      return (<View></View>)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => (<View style={styles.item}>
            <View style={styles.topicItem}>
              <TouchableOpacity onPress={()=>{this.goTo(topic)}}>
                <View>
                  <View style={styles.itemHead}>
                    <View>
                      <TouchableOpacity onPress={()=>{this.toPeople(topic.user_id)}}>
                        <Image source={{uri:'https:'+topic.user_id.avatar_url}} style={styles.avatar}  />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text onPress={()=>{this.toPeople(topic)}}>{topic.user_id.nickname}</Text>
                      <Text>
                        {topic.topic_id.name} {topic.view_count ? topic.view_count+'次浏览' : null} {topic.like_count ? topic.like_count+'个赞' : null} {topic.follow_count ? topic.follow_count+'人关注' : null}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.itemMain}>
                    <Text style={styles.title}>{topic.title}</Text>
                    <Text>{topic.content_summary}</Text>
                    <View style={styles.flexContainer}>
                      {topic.images.map(img=>{
                        let _img = 'https:' + img.split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!200/format/jpg'
                        return (<Image key={img} source={{uri:_img}} style={styles.images} />)
                      })}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {topic.comment && topic.comment.map(item=>{
                return (<View key={item._id}>
                  <TouchableOpacity onPress={()=>{this.goToComment(item)}}>
                    <View>
                      <CommentItem {...this.props} comment={item} />
                    </View>
                  </TouchableOpacity>
                </View>)
              })}
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
    )
  }

  goTo(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
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
      self.loadPostsList()
    }
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.loadPostsList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

}

export default connect((state, props) => ({
    // state: state，
    list: getPostListByName(state, props.name)
  }),
  (dispatch) => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)(PostsList)
