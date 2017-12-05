
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, PixelRatio } from 'react-native'
import WriteIcon from '../ui/icon/write'

import { ifIphoneX } from 'react-native-iphone-x-helper'

class Tabbar extends Component {
  render() {

    const { tabs, activeTab, goToPage, navigation } = this.props

    return(<View style={styles.tabbar}>
        <View style={styles.itemFixed}></View>
        <View style={styles.item}>
          {tabs.map((item, index)=>{
            return (<TouchableOpacity key={index} onPress={()=>{ goToPage(index) }} style={activeTab == index ? styles.tabActive : styles.tab} activeOpacity={0.8}>
                  <Text style={{ color: activeTab == index ? '#08f' : '#333', fontSize:16, fontWeight: 'bold' }}>{item}</Text>
              </TouchableOpacity>)
          })}
        </View>
        <View style={styles.itemFixed}>
          <TouchableOpacity onPress={()=>{ navigation.navigate('ChooseTopic') }} activeOpacity={0.8}>
            <WriteIcon />
          </TouchableOpacity>
        </View>
      </View>)
  }
}

var styles = StyleSheet.create({
  tabbar: {

    ...ifIphoneX({
      backgroundColor: '#fff',
      paddingTop:30,
      height:75,
      flexDirection: 'row',
      borderBottomWidth: 1/PixelRatio.get(),
      borderColor: '#d4d4d4'
    }, {
      backgroundColor: '#fff',
      paddingTop:20,
      height:65,
      flexDirection: 'row',
      borderBottomWidth: 1/PixelRatio.get(),
      borderColor: '#d4d4d4'
    })
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tab: {
    borderBottomWidth: 3,
    borderColor: '#fff',
    width:80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabActive: {
    borderBottomWidth: 3,
    borderColor: '#08f',
    width:80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemFixed: {
    ...ifIphoneX({
      height: 45,
      width: 80,
      justifyContent: 'center',
      alignItems: 'center'
    }, {
      height: 45,
      width: 80,
      justifyContent: 'center',
      alignItems: 'center'
    })
  }
})

export default Tabbar
