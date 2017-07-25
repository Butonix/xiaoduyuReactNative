import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Alert,
  Image,
  TouchableWithoutFeedback,
  AsyncStorage
} from 'react-native'

import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { signout } from '../../actions/sign'

class Settings extends React.Component {

  static navigationOptions = {
    title: '设置'
  }

  constructor (props) {
    super(props)

    this.signOut = this.signOut.bind(this)
  }

  signOut() {

    const self = this
    const { navigation, signout } = this.props

    Alert.alert('', '您确认退出吗？', [
      {text:'取消',onPress:()=>{}},
      {text:'确定',onPress:()=>{
        signout()

        AsyncStorage.removeItem('token', function(res){

          global.cleanRedux()

          // setTimeout(()=>{

            global.signIn = false

            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'SignIn'})
              ]
            })

            self.props.navigation.dispatch(resetAction)

          // }, 2000)

          // navigation.goBack()
        })

      }}
    ])

  }

  render() {

    const { me } = this.props

    return (<ScrollView>
          <View>

            <View style={styles.itme}>
              <View><Text>头像</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>
            <View style={styles.itme}>
              <View><Text>修改名字</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>
            <View style={styles.itme}>
              <View><Text>性别</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>
            <View style={styles.itme}>
              <View><Text>个性签名</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>

            <View style={styles.gap}></View>

            <View style={styles.itme}>
              <View><Text>修改邮箱</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>
            <View style={styles.itme}>
              <View><Text>修改密码</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>

            <View style={styles.gap}></View>

            <View style={styles.itme}>
              <View><Text>QQ</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>
            <View style={styles.itme}>
              <View><Text>微博</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>
            <View style={styles.itme}>
              <View><Text>Github</Text></View>
              <View style={styles.itemIcon}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
            </View>

            <View style={styles.gap}></View>

            <View style={styles.itmeCenter}>
              <TouchableWithoutFeedback onPress={()=>{this.signOut()}}>
                <View style={styles.itme}><Text>退出</Text></View>
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
    width:20,
    height:20,
    backgroundColor: '#efefef'
  },
  icon: {
    width: 24,
    height: 24,
  },
  itme: {
    flexDirection: 'row',
    minHeight: 45,
    alignItems:'center',
    justifyContent: 'space-between',
    // justifyContent:'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  },
  itemIcon: {
    width:20
  },
  arrowRight: {
    width:20,
    height:20,
  },
  gap: {
    height: 10
  },
  itmeCenter: {
    flexDirection: 'row',
    minHeight: 45,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  }
});

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    signout: bindActionCreators(signout, dispatch)
  })
)(Settings);
