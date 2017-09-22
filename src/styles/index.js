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
    flex:1,
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


  // 圆角input
  radiusInput: {
    height: 45,
    borderColor: '#e2e2e2',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    justifyContent: 'center'
  },
  radiusInputTop: {
    height: 45,
    borderColor: '#e2e2e2',
    borderWidth: 1,
    paddingLeft: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center'
  },
  radiusInputCenter: {
    height: 45,
    borderColor: '#e2e2e2',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop:-1,
    justifyContent: 'center'
  },
  radiusInputBottom: {
    height: 45,
    borderColor: '#e2e2e2',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop:-1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center'
  },

  radiusInputLeft: {
    height: 45,
    borderColor: '#e2e2e2',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop:-1,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    justifyContent: 'center'
  },

  // margin
  m10: { margin:10 },
  mt10: { marginTop:10 },
  mr10: { marginRight:10 },
  mb10: { marginBottom:10 },
  ml10: { marginLeft:10 },
  m20: { margin:20 },
  mt20: { marginTop:20 },
  mr20: { marginRight:20 },
  mb20: { marginBottom:20 },
  ml20: { marginLeft:20 },

  // padding
  p10: { padding:10 },
  pt10: { paddingTop:10 },
  pr10: { paddingRight:10 },
  pb10: { paddingBottom:10 },
  pl10: { paddingLeft:10 },
  p20: { padding:20 },
  pt20: { paddingTop:20 },
  pr20: { paddingRight:20 },
  pb20: { paddingBottom:20 },
  pl20: { paddingLeft:20 },

  // color
  red: { color: 'rgb(232, 60, 60)' },
  yellow: { color: 'rgb(255, 132, 42)' },
  darkGray: { color: 'rgb(150, 150, 150)' },
  white: { color: '#fff' },

  // bg
  bgPrimary: {
    backgroundColor: '#337ab7',
    padding:10,
    borderRadius: 5
  },
  bgSuccess: {
    backgroundColor: '#dff0d8',
    padding:10,
    borderRadius: 5
  },
  bgInfo: {
    backgroundColor: '#d9edf7',
    padding:10,
    borderRadius: 5
  },
  bgWarning: {
    backgroundColor: '#fcf8e3',
    padding:10,
    borderRadius: 5
  },
  bgDange: {
    backgroundColor: '#f2dede',
    padding:10,
    borderRadius: 5
  }
})

export default styles
