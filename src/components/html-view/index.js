

import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import HTMLView from 'react-native-htmlview'

import Img from '../image'

class HtmlView extends Component {

  constructor (props) {
    super(props)
  }

  render () {

    return (
      <HTMLView
        stylesheet={htmlStyles}
        value={this.props.html}
        onLinkPress={(url) => console.log('clicked link: ', url)}
        renderNode={renderNode}
        addLineBreaks={false}
      />
    )
  }

}

function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name == 'img') {
    return (<Img key={index} image={node.attribs.src} />)
  }
}

const htmlStyles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    padding:1,
    margin:1,
    backgroundColor:'#efefef',
    lineHeight: 16,
    textAlign: 'center',
  },
  wrapper:{
    margin:0,
    padding:0
  }
})

export default HtmlView
