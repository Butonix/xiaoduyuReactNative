import React, { Component } from 'react'
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
  Button,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { addComment } from '../../actions/comment'
import { setTopic } from '../../actions/write-posts'

class ChooseTopic extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      headerLeft: (<View><Button onPress={()=>params.cancel()} title={"取消"} /></View>),
      title: '请选择一个话题'
      // headerRight: (<View><Button onPress={()=>params.submit()} title={"发布"} /></View>),
    }

  }

  constructor (props) {
    super(props)
    this.cancel = this.cancel.bind(this)
    this.choose = this.choose.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      cancel: this.cancel
    })
  }

  cancel() {
    const { navigation } = this.props
    navigation.goBack()
  }

  choose() {
    this.props.setTopic({ topic: { id: '123', name: '测试'} })
    this.cancel()
  }

  render() {
    
    const { me } = this.props

    return (<View>
      <View style={styles.title}><Text>请选择一个话题</Text></View>
      <TouchableOpacity onPress={()=>{ this.choose('123467') }} style={styles.title}>
        <View><Text>测试话题</Text></View>
      </TouchableOpacity>
    </View>)
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    height: 40,
    justifyContent: 'center',
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  content: {
    height: 300,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: '#fff'
  }
});

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch),
    setTopic: bindActionCreators(setTopic, dispatch)
  })
)(ChooseTopic);
