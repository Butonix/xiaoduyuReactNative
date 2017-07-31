

import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

class ListItem extends Component {

  constructor (props) {
    super(props)
  }

  render() {

    const { name } = this.props

    return (<View style={styles.item}>
      <View style={styles.minItem}><Text>{name}</Text></View>
      <View style={styles.minItem}></View>
      <View style={styles.itemRight}><Image source={require('./images/arrow-right.png')} style={styles.arrowRight} /></View>
    </View>)
  }
}


const styles = StyleSheet.create({
  item:{

    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderColor: '#dce0e0',
    borderBottomWidth: 1,

    flexDirection: 'row'
  },
  minItem: {
    flex: 1,
    height:45,
    justifyContent: 'center',
  },
  itemRight: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowRight: {
    width:20,
    height:20
  }
})

export default ListItem
