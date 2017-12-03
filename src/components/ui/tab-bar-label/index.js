
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

class Button extends Component {

  constructor (props) {
    super(props)
  }

  render() {

    const { focused, text } = this.props

    return (<View style={stylesIcon.tabBarLabel}>
      <View style={stylesIcon.tabBarLabelView}><Text>text</Text></View>
      <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
      </View>)
  }
}

const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 },
  tabBarLabel: {
    marginTop:20,
    flex:1,
    width:'100%',
    // height:45,
    // flexDirection: 'row'
  },
  tabBarLabelView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelLine: {
    height:3,
    backgroundColor:'#fff'
  },
  focused: {
    backgroundColor:'#08f'
  }
})

export default Button
