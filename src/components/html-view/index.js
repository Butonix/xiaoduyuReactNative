

import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
// import HTMLView from 'react-native-htmlview'
import HTML from 'react-native-render-html'

import Img from '../image'

class HtmlView extends Component {

  constructor (props) {
    super(props)
    this.renderNode = this.renderNode.bind(this)
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {

    const { imgOffset = 0 } = this.props

    if (node.name == 'img') {
      return (<Img key={index} image={node.attribs.src} offset={imgOffset} />)
    }
  }
  
  render () {

    const { imgOffset = 0 } = this.props

    const stylesHtml = {
    		h1: { backgroundColor: '#FF0000' },
    		h2: { fontFamily: 'Arial' },
        img: { resizeMode: 'cover' },
        p: { paddingLeft: 15, paddingRight:15, lineHeight: 20 }
    	}

    const renderers = {
    	 	img: (htmlAttribs, children, passProps) => {
          return (<Img key={htmlAttribs.src} image={htmlAttribs.src} offset={imgOffset} />)
    	 	}
    	}

    return (<HTML
      			html={this.props.html}
      			htmlStyles={stylesHtml}
      			onLinkPress={(evt, href) => console.log(href)}
      			renderers={renderers}
      		/>)

    /*
    return (
      <HTMLView
        stylesheet={htmlStyles}
        value={this.props.html}
        onLinkPress={(url) => console.log('clicked link: ', url)}
        renderNode={this.renderNode}
        addLineBreaks={false}
      />
    )
    */
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
