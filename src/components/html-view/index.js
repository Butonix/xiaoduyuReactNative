

import React, { Component } from 'react'
import { StyleSheet, View, Text, Linking } from 'react-native'
import HTMLView from 'react-native-htmlview'
// import HTML from 'react-native-render-html'
// import HtmlRender from 'react-native-html-render'

import Img from '../image'



class HtmlView extends Component {

  constructor (props) {
    super(props)
    this.renderNode = this.renderNode.bind(this)
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {

    const { imgOffset = 0 } = this.props
    // console.log(node);

    if (node.name == 'img') {
      return (
          <Img key={index} image={node.attribs.src} offset={imgOffset} />
        )
    }

    /*
    else if (node.type == 'text' && node.parent.name == 'pre') {
      return (<View key={index} style={{ flex:1, padding:10,backgroundColor:'red', width:200, height:200}}>
        <Text>{node.data}</Text>
      </View>)
    }
    */

    // if (node.name == 'blockquote') {
    //   return (<View styles={styles.global}></View>)
    // }
  }


  render () {

    /*
    const { imgOffset = 0 } = this.props

    const stylesHtml = {
    		h1: { backgroundColor: '#FF0000' },
    		h2: { fontFamily: 'Arial' },
        img: { resizeMode: 'cover' },
        p: { paddingLeft: 0, paddingRight:0, lineHeight: 0 },
        ul: { paddingLeft: 0, paddingRight:0 },
        ol: { paddingLeft: 0, paddingRight:0 },
        li: { padding:0, margin: 0 },
        blockquote: {
          paddingTop:10, paddingLeft:10, paddingRight:10, backgroundColor: '#efefef', marginTop:0, marginBottom:0, lineHeight:0,
          borderLeftWidth: 2,
          borderColor: '#333'
        },
        pre: { paddingTop:10, paddingLeft:10, paddingRight:10, backgroundColor: '#efefef', marginTop:0, marginBottom:0, lineHeight:0 }
      }

    const renderers = {
    	 	img: (htmlAttribs, children, passProps) => {
          return (<View><Img key={htmlAttribs.src} image={htmlAttribs.src} offset={imgOffset} /></View>)
    	 	}
    	}

    return (<HTML
      			html={this.props.html}
      			htmlStyles={stylesHtml}
      			onLinkPress={(evt, href) => console.log(href)}
      			renderers={renderers}
      		/>)
    */

    return (
      <HTMLView
        stylesheet={htmlStyles}
        value={this.props.html}
        onLinkPress={(url) => Linking.openURL(url)}
        renderNode={this.renderNode}
        addLineBreaks={false}
      />
    )

  }

}


const htmlStyles = StyleSheet.create({
  a: {
    color: '#008cff', // make links coloured pink
  },
  blockquote: {
    color: 'red'
    // padding:10,
    // backgroundColor: '#333'
  },
  // pre: {
  //   lineHeight:30,
  //   color: 'green',
  //   backgroundColor: '#efefef'
  // },
  p: {
    padding:1,
    margin:1,
    lineHeight: 20,
    textAlign: 'center',
  },
  wrapper:{
    margin:0,
    padding:0
  }
})

export default HtmlView
