
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
  TouchableOpacity,
  Button
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { loadTopicList, followTopic, unfollowTopic } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'
import FollowButton from '../../components/follow-button'

import Loading from '../ui/loading'
import Nothing from '../nothing'

class TopicList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this)
    this.loadPostsList = this.loadPostsList.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.toTopic = this.toTopic.bind(this)
  }

  toTopic(topic) {
    const { navigate } = this.props.navigation

    navigate('TopicDetail', { title: topic.name, topic })
  }

  componentDidMount() {

    const self = this
    const { list } = this.props

    if (!list.data) {
      this.loadPostsList(()=>{
        // self.setState({})
      })
    }

  }

  loadPostsList(callback, restart) {

    const { name, filters } = this.props

    this.props.loadTopicList({
      name:name,
      filters,
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

    const { list } = this.props

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

    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="还未关注话题" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(list.data || [])

    console.log(list);

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => (<TouchableOpacity onPress={()=>{this.toTopic(topic)}}>
            <View style={styles.item}>
              <View style={styles.itemLeft}><Image source={{uri:'https:'+topic.avatar}} style={styles.avatar} /></View>
              <View style={styles.itemCenter}><Text>{topic.name}</Text><Text style={styles.brief}>{topic.brief}</Text></View>
              <View style={styles.itemRight}>
                <FollowButton topic_id={topic._id} follow={topic.follow} />
              </View>
            </View>
          </TouchableOpacity>)}
          scrollEventThrottle={50}
          removeClippedSubviews={false}
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
  item: {
    backgroundColor: '#fff',
    padding:15,
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  itemLeft: {
    width:50
  },
  itemCenter: {
    flex:1
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
  },
  button: {
    backgroundColor: '#333'
  },
  followButton: {
    padding: 7,
    borderColor: 'rgb(6, 181, 228)',
    borderWidth: 1,
    borderRadius: 5
  },
  gary: {
    borderColor: 'rgb(194, 194, 194)'
  },
  garyText: {
    color: 'rgb(194, 194, 194)'
  },
  followButtonText: {
    color: 'rgb(6, 181, 228)'
  }
})

export default connect((state, props) => ({
    list: getTopicListByName(state, props.name)
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(TopicList)
