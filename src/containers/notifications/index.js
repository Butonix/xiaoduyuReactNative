import React, { Component } from 'react'
import { StyleSheet, Image, View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUnreadNotice } from '../../reducers/user'
import { loadNewNotifications } from '../../actions/notification'

import NotificationList from '../../components/notification-list'

class Notifications extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    /*
    //     <Image
    //       source={require('./images/notification.png')}
    //       style={[styles.icon, {tintColor: tintColor}]}
    //       />
*/
    // params.unreadNotice = 3

    return {
      header: null,
      title: '通知',
      tabBarLabel: '通知',
      // tabBarVisible: false,
      tabBarIcon: ({ tintColor }) => (
        <View>
          {params.unreadNotice && params.unreadNotice.length > 0 ?
            <View style={styles.subscript}><Text style={styles.subscriptText}>{params.unreadNotice.length}</Text></View>
            : null}
        </View>
      ),
      tabBarOnPress: (scene, jumpToIndex)=>{

        const { params = {} } = navigation.state

        if (params.loadNewNotifications) {
          params.loadNewNotifications({ name:'notification', filters: {} })
        }

        jumpToIndex(scene.index)
      }
    }

  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {

    // const self = this
    // const { unreadNotice, loadNewNotifications } = this.props
    //
    // this.props.navigation.setParams({
    //   unreadNotice,
    //   loadNewNotifications
    // })
  }

  componentWillReceiveProps(props) {

    if (this.props.unreadNotice != props.unreadNotice) {
      const self = this
      const { unreadNotice, loadNewNotifications } = props
      this.props.navigation.setParams({
        unreadNotice,
        loadNewNotifications
      })
    }
  }

  render() {
    return (<NotificationList {...this.props} name="notification" />)
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  subscript: {
    position:'absolute',
    zIndex:99,
    marginLeft:7,
    marginTop:10,
    backgroundColor: 'red',
    borderRadius: 15,
    paddingLeft:5,
    paddingRight:5,
    minWidth:10,
    height:15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subscriptText: {
    color: '#fff',
    fontSize:11
  }
})

export default connect(state => ({
    unreadNotice: getUnreadNotice(state)
  }),
  (dispatch) => ({
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  })
)(Notifications)
