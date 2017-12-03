
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, Animated, Easing } from 'react-native'
import WriteIcon from '../ui/icon/write'

class Tabbar extends Component {
  render() {

    const { tabs, activeTab, goToPage, navigation } = this.props

    return(<View style={styles.tabbar}>
        <View style={styles.itemFixed}></View>
        <View style={styles.item}>
          {tabs.map((item, index)=>{
            return (<TouchableOpacity key={index} onPress={()=>{ goToPage(index) }} style={activeTab == index ? styles.tabActive : styles.tab}>
                  <Text style={{ color: activeTab == index ? '#08f' : '#333', fontSize:16 }}>{item}</Text>
              </TouchableOpacity>)
          })}
        </View>
        <View style={styles.itemFixed}>
          <View></View>
          {/* <TouchableOpacity onPress={()=>{ navigation.navigate('ChooseTopic', { typeId: 1, goBackKey: navigation.state.key }) }}> */}
          <TouchableOpacity onPress={()=>{ navigation.navigate('ChooseTopic') }}>
            <WriteIcon />
          </TouchableOpacity>
        </View>
      </View>)
  }
}

var styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#fff',
    paddingTop:20,
    height:70,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eaeaeb'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tab: {
    borderBottomWidth: 3,
    borderColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    width:80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabActive: {
    borderBottomWidth: 3,
    borderColor: '#08f',
    marginLeft: 10,
    marginRight: 10,
    width:80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemFixed: {
    height: 50,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Tabbar
