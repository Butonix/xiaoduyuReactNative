
import React, { PureComponent } from 'react'
import { Text, View, StyleSheet } from 'react-native'

class nothing extends PureComponent {
  render() {
    return (<View style={styles.nothingView}>
      <Text style={styles.nothingText}>没有帖子</Text>
    </View>)
  }
}

const styles = StyleSheet.create({
  nothingView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nothingText: {
    color:'rgb(128, 128, 128)'
  }
})

export default nothing
