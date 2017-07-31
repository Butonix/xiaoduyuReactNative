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
  TextInput
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadPeopleById } from '../../actions/people'
import { getPeopleById } from '../../reducers/people'
import { ListItem } from '../../components/ui'

class PeopleDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: '写评论'
      // headerRight: (<View><Button onPress={()=>params.submit()} title={"关注"} /></View>),
    }

  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    // console.log(this);
    const { id } = this.props.navigation.state.params

    const { loadPeopleById } = this.props
    const [ people ] = this.props.people

    if (!people) {
      loadPeopleById({
        id
      })
    }

  }

  render() {

    const [ people ] = this.props.people

    if (!people) {
      return (<View>
        <Text>Loading...</Text>
      </View>)
    }

    return (<View>
      <View style={styles.head}>
        {people.avatar_url ? <Image source={{uri:'https:'+people.avatar_url}} style={styles.avatar}  /> : null}
        {people.nickname ? <Text>{people.nickname}</Text> : null}
        {people.brief ? <Text>{people.brief}</Text> : null}
      </View>
      <ListItem name={`他发布的帖子 ${people.posts_count || ''}`} />
      <ListItem name={`他关注的帖子 ${people.follow_posts_count || ''}`} />
      <ListItem name={`他的评论 ${people.comment_count || ''}`} />
      <ListItem name={`他的关注的话题 ${people.follow_topic_count || ''}`} />
      <ListItem name={`他关注的人 ${people.follow_people_count || ''}`} />
      <ListItem name={`他的粉丝 ${people.fans_count || ''}`} />
    </View>)
  }
}


const styles = StyleSheet.create({
  head: {
    paddingTop:10,
    paddingBottom:10,
    marginBottom:10,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  }
})

export default connect((state, props) => ({
    people: getPeopleById(state, props.navigation.state.params.id)
  }),
  (dispatch) => ({
    loadPeopleById: bindActionCreators(loadPeopleById, dispatch)
  })
)(PeopleDetail);
