import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'

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

    if (!me) {
      return (<View></View>)
    }

    return (<ScrollView>

          <View>

            <View style={styles.avatarItem}>
              <View><Image source={{uri:'https:'+me.avatar_url}} style={styles.avatar} /></View>
              <View><Text>{me.nickname}</Text></View>
            </View>

            <View>
              <View style={styles.itme}><Text>我创建的帖子</Text></View>
              <View style={styles.itme}><Text>我编写的评论</Text></View>
              <View style={styles.gap}></View>
              <View style={styles.itme}><Text>我关注的帖子</Text></View>
              <View style={styles.itme}><Text>我关注的话题</Text></View>
              <View style={styles.itme}><Text>我关注的人</Text></View>
              <View style={styles.itme}><Text>我的粉丝</Text></View>
              <View style={styles.gap}></View>

              <TouchableWithoutFeedback onPress={()=>{ this.props.navigation.navigate('Settings') }}>
                <View style={styles.itme}><Text>设置</Text></View>
              </TouchableWithoutFeedback>
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
