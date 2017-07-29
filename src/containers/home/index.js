
import PostsList from '../../components/posts-list'
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity } from 'react-native'
import Headroom from 'react-native-headroom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadUserInfo, addAccessToken } from '../../actions/user'

class Home extends Component {

  static navigationOptions = {
    title: '首页',
    tabBarIcon: ({ tintColor }) => (<Image source={require('./images/home.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />)
  }

  componentDidMount() {
    this.toWritePosts = this.toWritePosts.bind(this)
  }

  toWritePosts(typeId) {
    const { navigate } = this.props.navigation
    navigate('WritePosts', { typeId: typeId })
  }

  render() {
    const { navigation } = this.props

    const header = (
      <View style={[styles.container, styles.header]}>
        <TouchableOpacity onPress={()=>{this.toWritePosts(1)}} style={styles.headerItem}>
          <View><Text style={styles.headerItemText}>说说</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.toWritePosts(2)}} style={styles.headerItem}>
          <View><Text style={styles.headerItemText}>提问</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.toWritePosts(3)}} style={styles.headerItem}>
          <View><Text style={styles.headerItemText}>写文章</Text></View>
        </TouchableOpacity>
      </View>
    )

    return (<View style={[styles.container]}>
      <Headroom
        style={[styles.container]}
        headerComponent={ header }
        ScrollableComponent={ScrollView}
        headerHeight={ 40 }
        scrollEventThrottle={ 40 }
      >
      </Headroom>
        <View style={[styles.container, styles.content]}>
          <PostsList
            navigation={navigation}
            name="home"
            filters={{
              include_comments: 1,
              comments_sort: 'create_at:-1'
            }}
            />
        </View>

    </View>)
  }
}

const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#dce0e0'
  },
  headerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#dce0e0'
  },
  headerItemText: {
    color: '#484848'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loremIpsum: {
    fontSize: 24,
  },
})

export default connect(state => ({
    state
  }),
  (dispatch) => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    addAccessToken: bindActionCreators(addAccessToken, dispatch)
  })
)(Home);
