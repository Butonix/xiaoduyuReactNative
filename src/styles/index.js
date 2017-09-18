import { StyleSheet } from 'react-native'


const styles = StyleSheet.create({
  button:{
    backgroundColor:'rgb(22, 177, 244)',
    height:50,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullButton: {
    backgroundColor:'#0f98d8',
    height:45,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20
  },
  borderButton: {
    backgroundColor:'#fff',
    height:45,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20,
    borderWidth:1,
    borderColor: '#0f98d8'
  },
  whiteButton: {
    height:50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 50,
    fontSize: 14,
    borderBottomWidth:1,
    borderColor: '#dce0e0'
  },

  // 圆角input
  radiusInput: {
    height: 45,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5
  },
  radiusInputTop: {
    height: 45,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  radiusInputCenter: {
    height: 45,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop:-1
  },
  radiusInputBottom: {
    height: 45,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop:-1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },

  radiusInputLeft: {
    height: 45,
    borderColor: '#efefef',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop:-1,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5
  },


  item: {
    paddingLeft:15,
    paddingRight:15,
    backgroundColor: '#fff'
  },
  rowItem: {
    flexDirection: 'row',
    paddingLeft:15,
    paddingRight:15,
    backgroundColor: '#fff'
  },
  // 标题栏样式
  headerStyle: {
    backgroundColor: '#fff'
  },
  loading: {
    height:50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  //
  mt10: { marginTop:10 },
  mr10: { marginRight:10 },
  mb10: { marginBottom:10 },
  ml10: { marginLeft:10 },
  mt20: { marginTop:20 },
  mr20: { marginRight:20 },
  mb20: { marginBottom:20 },
  ml20: { marginLeft:20 }
})

export default styles
