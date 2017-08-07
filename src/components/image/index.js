import React from 'react'
import { Image } from 'react-native'
import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width - 20

class Img extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
    }
  }

  componentDidMount() {

    const self = this

    Image.getSize(this.props.image, (width, height) => {
      height = screenWidth * height / width; //按照屏幕宽度进行等比缩放

      if (!self._reactInternalInstance) return

      self.setState({
        width: screenWidth,
        height
      })
    })
  }

  render() {
    return (
      <Image
        style={{width: this.state.width, height: this.state.height}}
        source={{uri: this.props.image}} />
    )
  }
}

export default Img
