import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setTopic } from '../../actions/write-posts'
import { loadTopicList } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

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

  componentWillMount() {
    const { topicList, loadTopicList } = this.props
    if (topicList && topicList.data) {
    } else {
      loadTopicList({ name: 'all-topic', filters: { per_page: 500 } })
    }
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

  choose(topic) {
    this.props.setTopic({ topic: topic })
    this.cancel()
  }

  render() {

    const { topicList } = this.props

    if (!topicList.data) {
      return (<View></View>)
    }

    let parentTopicList = []
    let childTopicList = {}

    if (topicList.data) {

      for (let i = 0, max = topicList.data.length; i < max; i++) {

        let topic = topicList.data[i]

        if (!topic.parent_id) {
          parentTopicList.push(topic)
        } else {
          if (!childTopicList[topic.parent_id]) {
            childTopicList[topic.parent_id] = []
          }
          childTopicList[topic.parent_id].push(topic)
        }
      }
    }

    return (<ScrollView>
      {parentTopicList.map(item=>{
        return (<View key={item._id} style={styles.container}>
                  <View><Text style={styles.title}>{item.name}</Text></View>
                  <View style={styles.itemContainer}>
                    {childTopicList[item._id] && childTopicList[item._id].map(item=>{
                      return (<TouchableOpacity
                        style={styles.item}
                        key={item._id}
                        onPress={()=>{this.choose(item)}}>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>)
                    })}
                  </View>
                </View>)
      })}
    </ScrollView>)
  }
}

const styles = StyleSheet.create({
  container: {
    padding:20
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    paddingTop: 10,
    paddingRight: 10
  },
  title: {
    color:'#rgb(120, 120, 120)'
  }
});

export default connect(state => ({
    topicList: getTopicListByName(state, 'all-topic')
  }),
  (dispatch) => ({
    setTopic: bindActionCreators(setTopic, dispatch),
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(ChooseTopic);
