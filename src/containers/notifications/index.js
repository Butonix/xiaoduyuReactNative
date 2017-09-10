import React, { Component } from 'react'
import { StyleSheet, Image, View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUnreadNotice } from '../../reducers/user'

import NotificationList from '../../components/notification-list'

class Notifications extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: '通知',
      tabBarLabel: '通知',
      // tabBarVisible: false,
      tabBarIcon: ({ tintColor }) => (
        <View>
          {params.unreadNotice ?
            <View style={styles.subscript}><Text style={styles.subscriptText}>{params.unreadNotice}</Text></View>
            : null}
          <Image
            source={require('./images/notification.png')}
            style={[styles.icon, {tintColor: tintColor}]}
            />
        </View>
      )
    }

  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {

    const self = this
    const { unreadNotice } = this.props

    this.props.navigation.setParams({
      unreadNotice
    })

  }

  componentWillReceiveProps(props) {

    if (this.props.unreadNotice != props.unreadNotice) {
      const self = this
      const { unreadNotice } = props
      this.props.navigation.setParams({
        unreadNotice
      })
    }

  }

  render() {
    return (<View>
      <NotificationList {...this.props} name="notification" />
    </View>)
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
    marginLeft:15,
    backgroundColor: 'red',
    borderRadius: 30,
    paddingLeft:5,
    paddingRight:5
  },
  subscriptText: {
    color: '#fff',
    fontSize:12
  }
})

export default connect(state => ({
    unreadNotice: getUnreadNotice(state)
  }),
  (dispatch) => ({
  })
)(Notifications)
