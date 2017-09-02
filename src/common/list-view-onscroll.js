
const onScroll = (callback) => {
  return (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (y + height >= contentHeight - 20) callback()
  }
}

export default onScroll
