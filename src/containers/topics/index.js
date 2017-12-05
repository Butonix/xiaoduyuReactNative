import React, { Component } from 'react'
import { StyleSheet, Text, View, ListView, Image } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import { loadTopicList, followTopic, unfollowTopic } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import TopicList from '../../components/topic-list'
import Loading from '../../components/ui/loading'
// import PostsList from '../../components/posts-list'

import TabBar from '../../components/tab-bar'

class Topic extends React.Component {

  static navigationOptions = {
    header: null,
    title: '话题',
    // tabBarLabel: (props) => {
    //   return (<View style={stylesIcon.tabBarLabel}>
    //     <View style={stylesIcon.tabBarLabelView}><Text>话题</Text></View>
    //     <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
    //     </View>)
    // }
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('./images/topic.png')} style={[stylesIcon.icon, {tintColor: tintColor}]} />
    )
  }

  componentDidMount() {

    const self = this
    const { list } = this.props

    if (!list.data) {
      this.props.loadTopicList({
        name: 'index',
        filters: {
          child:-1, per_page:100
        },
        callback: (res) => {
          console.log(res);
        }
      })
    }

  }
  render() {
    const self = this
    const { list } = this.props
    const { navigation } = this.props

    if (!list || !list.data || list.data.length == 0) {
      return (<Loading />)
    }

    return (<ScrollableTabView
      renderTabBar={() => <TabBar navigation={navigation} onScroll={(e)=>{ self.updateAnimation = e }} />}
      onScroll={(e)=>self.updateAnimation(e)}
      // style={{
      //   paddingTop: 15,
      //   backgroundColor: '#fff'
      // }}
      // tabBarBackgroundColor={"#fff"}
      // tabBarTextStyle={{
      //   fontSize:16,
      //   marginTop:15
      // }}
      // tabBarUnderlineStyle={{
      //   backgroundColor:'#08f',
      //   height:3
      // }}
      // tabBarActiveTextColor="#08f"
      >

      <TopicList tabLabel={'全部'} name="all" filters={{ child:1, per_page:20 }} {...this.props} />

      {list.data.map(item=>{
        return (<TopicList
          key={item._id}
          tabLabel={item.name}
          name={item._id}
          filters={{ child:1, per_page:20, parent_id:item._id  }}
          {...this.props}
          />)
      })}
    </ScrollableTabView>)


    return <TopicList name="topic" filters={{ child:1, per_page:10 }} {...this.props} />
  }
}

const stylesIcon = StyleSheet.create({
  icon: { width: 26, height: 26, marginTop:-5 },
  tabBarLabel: {
    marginTop:20,
    flex:1,
    width:'100%',
    // height:45,
    // flexDirection: 'row'
  },
  tabBarLabelView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelLine: {
    height:3,
    backgroundColor:'#fff'
  },
  focused: {
    backgroundColor:'#08f'
  }
})

export default connect((state, props) => ({
    list: getTopicListByName(state, 'index')
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(Topic)

// export default Topic
