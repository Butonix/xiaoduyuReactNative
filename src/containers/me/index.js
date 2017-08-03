import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'

import { ListItem } from '../../components/ui'

class Me extends React.Component {

  static navigationOptions = {
    title: '我的',
    tabBarIcon: ({ tintColor }) => (<Image source={require('./images/me.png')} style={[styles.icon, {tintColor: tintColor}]} />)
  }

  constructor (props) {
    super(props)
  }

  render() {

    const { me } = this.props
    const { navigate } = this.props.navigation

    if (!me) {
      return (<View></View>)
    }

    return (<ScrollView>

          <View>


            <TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Settings') }}>

              <View style={styles.avatarItem}>
                <View><Image source={{uri:'https:'+me.avatar_url}} style={styles.avatar} /></View>
                <View><Text>{me.nickname}</Text></View>
              </View>

            </TouchableOpacity>

            <View>

              <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'PostsList', id: me._id, filters: { user_id: me._id }, title: me.nickname + '的帖子' }) }}>
                <ListItem name={"我创建的帖子"} rightText={me.posts_count} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPosts', id: me._id + '-posts', filters: { user_id: me._id, posts_exsits: 1 }, title: me.nickname + '关注的帖子' }) }}>
                <ListItem name={"我编写的评论"} rightText={me.follow_posts_count} />
              </TouchableOpacity>

              <View style={styles.gap}></View>

              <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'CommentList', id: me._id, filters: { user_id: me._id }, title: me.nickname + '的评论' }) }}>
                <ListItem name={"我关注的帖子"} rightText={me.comment_count} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'TopicList', id: me._id, filters: { people_id: me._id }, title: me.nickname + '关注的话题' }) }}>
                <ListItem name={"我关注的话题"} rightText={me.follow_topic_count} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPeopleList', id: me._id + '-follow', filters: { user_id: me._id, people_exsits: 1 }, title: me.nickname + '关注的人' }) }}>
                <ListItem name={"我关注的人"} rightText={me.follow_people_count} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPeopleList', id: me._id + '-fans', filters: { people_id: me._id, people_exsits: 1 }, title: me.nickname + '的粉丝' }) }}>
                <ListItem name={"我的粉丝"} rightText={me.fans_count} />
              </TouchableOpacity>

              <View style={styles.gap}></View>

              <TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Settings') }}>
                <ListItem name={"设置"} />
              </TouchableOpacity>

            </View>
          </View>

      </ScrollView>)
  }
}


const styles = StyleSheet.create({
  avatarItem: {
    alignItems:'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  avatar: {
    width:80,
    height:80,
    borderRadius: 40,
    marginBottom:10
  },
  icon: {
    width: 24,
    height: 24,
  },
  itme: {
    height: 45,
    // alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  },
  gap: {
    height: 10
  }
});

// export default Me
export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
  })
)(Me);
