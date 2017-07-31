
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, Animated, Easing } from 'react-native'

class Tabbar extends Component {
  render() {

    const { tabs, activeTab, goToPage, navigation } = this.props

    return(<View style={styles.tabbar}>
        <View style={styles.itemFixed}></View>
        <View style={styles.item}>
          {tabs.map((item, index)=>{
            return (<TouchableOpacity key={index} onPress={()=>{ goToPage(index) }} style={activeTab == index ? styles.tabActive : styles.tab}>
                  <Text style={{ color: activeTab == index ? 'red' : '#333' }}>{item}</Text>
              </TouchableOpacity>)
          })}
        </View>
        <View style={styles.itemFixed}>
          <View></View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={()=>{ navigation.navigate('WritePosts', { typeId: 1 }) }}
            >
            <Text>创建</Text>
          </TouchableOpacity>
        </View>
      </View>)
  }
}

var styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#fff',
    height:50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#dce0e0'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tab: {
    paddingTop:20,
    paddingTop:20,
    borderBottomWidth: 3,
    borderColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    width:60,
    alignItems: 'center'
  },
  tabActive: {
    paddingTop:20,
    paddingTop:20,
    borderBottomWidth: 3,
    borderColor: 'red',
    marginLeft: 10,
    marginRight: 10,
    width:60,
    alignItems: 'center'
  },
  itemFixed: {
    height: 50,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Tabbar
