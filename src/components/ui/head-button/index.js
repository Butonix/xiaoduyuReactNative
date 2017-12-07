

import React, { PureComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

class HeadButton extends PureComponent {

  constructor (props) {
    super(props)
  }

  render() {
    const { name = '按钮' } = this.props
    return (<View style={styles.button}>
      <Text style={styles.buttonText}>{name}</Text>
    </View>)
  }
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    paddingLeft:20,
    paddingRight:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#08f'
  }
})

export default HeadButton
