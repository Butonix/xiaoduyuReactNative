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
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadTopicList } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'


class TopicList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this)
    this.loadPostsList = this.loadPostsList.bind(this)
    this.test = this.test.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.toTopic = this.toTopic.bind(this)
  }

  toTopic(topic) {
    const { navigate } = this.props.navigation;

    navigate('TopicDetail', { title: topic.name, id: topic._id })
  }

  test() {
    console.log('214')
  }

  componentDidMount() {

    console.log('话题列表加载了');

    const self = this
    this.loadPostsList(()=>{
      self.setState({})
    })
  }

  loadPostsList(callback, restart) {

    // let list = getPostListByName(this.props.state, 'test')

    this.props.loadTopicList({
      name:'test',
      callback,
      restart
    })
  }

  renderHeader() {
    return (
      <View>
        <Text>我是列表头部</Text>
      </View>
    )
  }

  renderFooter() {

    let list = getTopicListByName(this.props.state, 'test')

    if (list.loading) {
      return (
        <View>
          <Text>加载中</Text>
        </View>
      )
    }
    return (
      <View>
        <Text>没有更多了</Text>
      </View>
    )
  }

  render() {

    let list = getTopicListByName(this.props.state, 'test')

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(list.data || [])

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => (<TouchableOpacity onPress={()=>{this.toTopic(topic)}}><View style={styles.topicItem}>
            <Text>{topic.name}</Text><Text style={styles.brief}>{topic.brief}</Text>
          </View></TouchableOpacity>)}
          scrollEventThrottle={50}
          removeClippedSubviews={false}
        />
      </View>
    );
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

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
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
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
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
  brief: {
    color: '#8a8a8a'
  }
})

export default connect(state => ({
    state: state
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(TopicList);

// export default PostsList
