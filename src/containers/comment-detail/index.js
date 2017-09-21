

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, Button, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCommentById } from '../../actions/comment'
import { getCommentById } from '../../reducers/comment'
import { getUserInfo } from '../../reducers/user'

import HTMLView from '../../components/html-view'
import CommentList from '../../components/comment-list'
import BottomBar from '../../components/bottom-bar'
import MenuIcon from '../../components/ui/icon/menu'

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 0
const options = [ '取消', '编辑']

class CommentDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    let option = {
      headerTitle: params.title
    }

    if (params.menu) {
      option.headerRight = (<TouchableOpacity onPress={()=>params.menu()}><MenuIcon /></TouchableOpacity>)
    }

    return option
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.toPeople = this.toPeople.bind(this)
    this.showSheet = this.showSheet.bind(this)
    this.menu = this.menu.bind(this)
  }

  componentDidMount() {

    const self = this
    const id = this.props.navigation.state.params.id
    const { loadCommentById, comment, me } = this.props
    let { data } = comment

    if (!data || !data.length) {
      loadCommentById({
        id,
        callback: (res)=>{

          if (res && me._id == res.user_id._id) {
            self.props.navigation.setParams({
              menu: self.menu
            })
          }

        }
      })
      return
    }

    if (me._id == data[0].user_id._id) {
      this.props.navigation.setParams({
        menu: this.menu
      })
    }

  }

  menu(key) {
    this.ActionSheet.show()
  }

  showSheet(key) {

    if (!key) return

    let { data, loading } = this.props.comment

    let comment = data && data[0] ? data[0] : null

    const { navigate } = this.props.navigation
    navigate('WriteComment', { comment })

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: user.nickname, id: user._id })
  }

  render() {

    let { data, loading } = this.props.comment

    let comment = data && data[0] ? data[0] : null

    if (!comment) {
      return (<Text>加载中...</Text>)
    }

    return (<View style={styles.container}>
      <ScrollView style={styles.main}>

        <View style={styles.itemHead}>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(comment.user_id)}}>
              <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar}  />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={()=>{this.toPeople(comment.user_id)}}>
              <Text>{comment.user_id.nickname}</Text>
            </TouchableOpacity>
            <View>
              <Text>{comment._create_at}</Text>
            </View>
          </View>
        </View>

        <View style={styles.comment}>
          <HTMLView html={comment.content_html} />
        </View>

        <View>
          <CommentList
            {...this.props}
            name={comment._id + '-reply'}
            filters={{ parent_id: comment._id, parent_exists: 1, per_page: 100 }}
            displayReply={true}
            displayLike={true}
            displayCreateAt={true}
            />
        </View>
      </ScrollView>
      <BottomBar {...this.props} comment={comment} />
      <ActionSheet
        ref={o => this.ActionSheet = o}
        options={options}
        cancelButtonIndex={CANCEL_INDEX}
        destructiveButtonIndex={DESTRUCTIVE_INDEX}
        onPress={this.showSheet}
      />
      </View>)
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  main: {
    flex: 1
  },
  comment: {
    padding:15,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    padding:15,
    paddingBottom:0,
    flexDirection: 'row'
  },
  head: {
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  }
})

export default connect(
  (state, props) => {
    const id = props.navigation.state.params.id
    return {
      comment: getCommentById(state, id),
      me: getUserInfo(state)
    }
  },
  (dispatch, props) => ({
    loadCommentById: bindActionCreators(loadCommentById, dispatch)
  })
)(CommentDetail);
