
import React, { Component } from 'react'
import { View, Text, StyleSheet, RefreshControl } from 'react-native'

class _RefreshControl extends Component {

  constructor (props) {
    super(props)
    this.state = { display: false }
    this.onRefresh = this.onRefresh.bind(this)
  }

  onRefresh () {
    const self = this
    const { onRefresh } = this.props
    self.setState({ display: true })
    onRefresh(()=>self.setState({ display: false }))
  }

  render() {

    return (
      <RefreshControl
        refreshing={this.state.display}
        onRefresh={this.onRefresh}
        tintColor="#484848"
        title="加载中..."
        titleColor="#484848"
        colors={['#ff0000', '#00ff00', '#0000ff']}
        progressBackgroundColor="#ffffff"
      />
    )
  }

}

const styles = StyleSheet.create({
})

export default _RefreshControl
