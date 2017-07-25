

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  WebView,
  TouchableWithoutFeedback
} from 'react-native'

import { StackNavigator, TabNavigator } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsById } from '../../actions/posts'
import { like, unlike } from '../../actions/like'
import { getPostsById } from '../../reducers/posts'
import { getUserInfo } from '../../reducers/user'

import HTMLView from '../../components/html-view'
import Img from '../../components/image'
import CommentList from '../../components/comment-list'
import LikeButton from '../../components/like-button'

class PostsDetail extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.title
  })

  constructor (props) {
    super(props)
    this.state = {}
    this.goWriteComment = this.goWriteComment.bind(this)
    this.like = this.like.bind(this)
  }

  componentDidMount() {

    const self = this
    const id = this.props.navigation.state.params.id
    const { loadPostsById } = this.props.posts
    const [ posts ] = this.props.posts

    if (!posts) {
      loadPostsById({
        id,
        callback: (res)=>{
        }
      })
    }

  }

  goWriteComment() {

    const { navigate } = this.props.navigation
    const [ posts ] = this.props.posts
    const { me } = this.props

    if (me) {
      navigate('WriteComment', { postsId: posts._id })
    } else {
      navigate('SignIn')
    }

  }

  like() {

    const { navigate } = this.props.navigation
    const [ posts ] = this.props.posts
    const { me } = this.props

    // if (me) {
      navigate('WriteComment', { postsId: posts._id })
    // } else {
      // navigate('SignIn')
    // }

  }

  render() {

    const [ posts ] = this.props.posts

    let dom = <Text>加载中...</Text>

    if (posts) {

      dom = (<View>
        <View style={styles.posts}>
          <View style={styles.itemHead}>
            <View>
              <Image source={{uri:'https:'+posts.user_id.avatar_url}} style={styles.avatar}  />
            </View>
            <View>
              <Text onPress={()=>{this.test(posts)}}>{posts.user_id.nickname}</Text>
              <Text>
                {posts.topic_id.name} {posts.view_count ? posts.view_count+'次浏览' : null} {posts.like_count ? posts.like_count+'个赞' : null} {posts.follow_count ? posts.follow_count+'人关注' : null}
              </Text>
            </View>
          </View>
          <View style={styles.itemMain}>
            <Text>{posts.title}</Text>
            <HTMLView html={posts.content_html} />
          </View>
        </View>
        <View>
          <CommentList name={posts._id} filters={{ posts_id: posts._id, parent_exists: 0, per_page: 100 }} />
        </View>


      </View>)

    }

    return (<View style={styles.container}>
        <ScrollView style={styles.main}>{dom}</ScrollView>
        <View style={styles.bottomBar}>
          <TouchableWithoutFeedback onPress={()=>{this.goWriteComment()}}>
            <View><Text style={styles.comment}>评论</Text></View>
          </TouchableWithoutFeedback>
          <LikeButton type={"posts"} target_id={posts._id} {...this.props} />
          <Text style={styles.follow}>关注</Text>
        </View>
      </View>)
  }
}


const styles = StyleSheet.create({
  posts: {
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
    // marginTop:100
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  main: {
    flex: 2
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
  bottomBar: {
    // position:'absolute',
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
    // bottom:90,
    // right:20
  },
  comment: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  like: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  follow: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  }
});

export default connect((state, props) => {
    const id = props.navigation.state.params.id
    return {
      posts: getPostsById(state, id),
      me: getUserInfo(state)
    }
  },
  (dispatch) => ({
    loadPostsById: bindActionCreators(loadPostsById, dispatch)
  })
)(PostsDetail);
