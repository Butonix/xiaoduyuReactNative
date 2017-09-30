/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ScrollView,
  refreshControl,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserInfo } from '../../reducers/user'

import { loadCommentList } from '../../actions/comment'
import { getCommentListByName } from '../../reducers/comment'

import CommentItem from '../../components/comment-item'

import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'


class CommentList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this)
    this.load = this.load.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  componentWillMount() {

    const { list } = this.props

    if (!list.data || !list.data.length) {
      this.load()
    }

  }

  load(callback = ()=>{}, restart = false) {
    const { name, filters } = this.props
    this.props.loadCommentList({ name, filters, callback, restart })
  }

  renderFooter() {
    const { list } = this.props
    return (<View>{list.loading ? <Text>加载中</Text> : null}</View>)
  }

  render() {

    const {
      list,
      displayLike = false,
      displayReply = false,
      displayCreateAt = false,
      canClick = true,
      me
    } = this.props
    const { navigate } = this.props.navigation;

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有评论" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let array = ds.cloneWithRows(list.data || [])

    return (
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={array}
          renderRow={(item) => (<View>
              <CommentItem {...this.props} displayLike={displayLike} displayReply={displayReply} displayCreateAt={displayCreateAt} canClick={canClick} comment={item} />

              {item.reply && item.reply.map(item=>{
                return(<View key={item._id} style={styles.reply}>
                  <CommentItem {...this.props} displayLike={displayLike} displayReply={displayReply} displayCreateAt={displayCreateAt} canClick={canClick} comment={item} subitem={true} />
                </View>)
              })}

              {item.reply && item.reply_count > item.reply.length ?
                <TouchableOpacity
                  onPress={()=>{
                    navigate('CommentDetail', { title: item.content_summary, id: item._id })
                  }}
                  style={styles.more}>
                  <Text>还有{item.reply_count - item.reply.length}条回复，查看全部</Text>
                </TouchableOpacity>
                : null}

          </View>)}
          renderFooter={this.renderFooter}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff0000"
              title="加载中..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={50}
        />
      </View>
    )
  }

  goTo(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
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
      self.load()
    }
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.load(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

}


const styles = StyleSheet.create({
  reply: {
    paddingLeft: 60
  },
  more: {
    marginLeft:60,
    paddingTop:15,
    paddingBottom:15,
    borderTopWidth: 1,
    borderColor: '#efefef'
  }
})

export default connect((state, props) => {
    return {
      me: getUserInfo(state),
      list: getCommentListByName(state, props.name)
    }
  },
  (dispatch, props) => ({
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  })
)(CommentList);

// export default PostsList
