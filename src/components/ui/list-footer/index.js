
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Loading from '../loading'

class ListFooter extends PureComponent {

  render() {

    const { loading, more } = this.props

    return (
      <View style={styles.view}>
        {loading ? <Loading /> : null}
        {!more ? <Text>没有更多</Text> : null}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  view: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ListFooter
