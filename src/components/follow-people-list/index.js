
import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView, Image, refreshControl, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadFollowPosts } from '../../actions/follow'
import { getPeopleListByName } from '../../reducers/follow-people'

import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'

class FollowPeopleList extends Component {

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
    this.toPeople = this.toPeople.bind(this)
    this.loadList = this.loadList.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  componentWillMount() {

    const { list } = this.props

    // console.log(list);

    if (!list.data) {
      this.loadList()
    }

  }

  toPeople(people){
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  loadList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadList({ name: name, filters, callback, restart })
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

  render() {

    const self = this
    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let data = ds.cloneWithRows(list.data || [])

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={data}
          renderRow={(item) => {

            let people = list.filters.user_id ? item.people_id : item.user_id

            return (<View>
                <TouchableOpacity onPress={()=>{this.toPeople(people)}} style={styles.item}>
                  <View style={styles.itemLeft}><Image source={{uri:'https:'+people.avatar_url}} style={styles.avatar}  /></View>
                  <View style={styles.itemCenter}>
                    <View><Text>{people.nickname}</Text></View>
                    <View style={styles.other}>
                      {people.posts_count ? <Text>帖子{people.posts_count}</Text> : null}
                      {people.fans_count ? <Text>粉丝{people.fans_count}</Text> : null}
                      {people.comment_count ? <Text>评论{people.comment_count}</Text> : null}
                    </View>
                  </View>
                  <View style={styles.itemRight}>
                    <Text>关注</Text>
                  </View>
                </TouchableOpacity>
              </View>)

          }}
          // renderHeader={this.renderHeader}
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
    );
  }

}

const styles = StyleSheet.create({
  item: {
    padding:10,
    backgroundColor:'#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },
  loading: {
    height: 60
  },
  other: {
    flexDirection: 'row'
  },
  itemCenter:{
    flex: 1
  }
});


export default connect((state, props) => ({
    list: getPeopleListByName(state, props.name)
  }),
  (dispatch) => ({
    loadList: bindActionCreators(loadFollowPosts, dispatch)
  })
)(FollowPeopleList);
