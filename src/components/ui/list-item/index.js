

import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

class ListItem extends Component {

  constructor (props) {
    super(props)
  }

  render() {

    const { type, name, rightText } = this.props

    if (type == 'center') {
      return (<View style={[styles.item, styles.center]}>
        <Text>{name}</Text>
      </View>)
    }

    return (<View style={[styles.item, (type == 'center' ? styles.center : null)]}>
      <View style={styles.minItem}><Text>{name}</Text></View>
      <View style={styles.minItem}></View>
      <View style={styles.itemRight}>
        {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
        <Image source={require('./images/arrow-right.png')} style={styles.arrowRight} />
      </View>
    </View>)
  }
}


const styles = StyleSheet.create({
  item:{
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderColor: '#efefef',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 45
  },
  minItem: {
    flex: 1,
    height:45,
    justifyContent: 'center',
  },
  itemRight: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  arrowRight: {
    width:20,
    height:20
  },
  rightText: {
    marginRight: 10,
    color: '#rgb(176, 176, 176)'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ListItem
