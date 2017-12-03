import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  item: {
    marginTop: 10
  },
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },

  nothing: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  topicItem: {
    backgroundColor: '#fff',
    // padding:15
    // borderBottomWidth: 1,
    // borderColor: '#efefef'
  },
  itemHead: {
    flexDirection: 'row',
    padding:15,
    paddingBottom:0,
    marginBottom: 10
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10,
    marginTop: -4
  },
  nickname: {
    fontWeight: 'bold',
    color:'#484848'
  },
  itemHeadOther: {
    marginTop: 5,
    flexDirection: 'row'
  },
  itemHeadOtherItem: {
    fontSize: 12,
    color: '#aba8a6',
    marginRight: 10
  },
  itemMain: {
    padding:15,
    paddingTop:0
    // marginTop:10
  },
  images:{
    flex: 1,
    // width: 100,
    height: 200,
    // marginTop:10,
    // marginRight:10,
    marginBottom:20,
    backgroundColor:'#efefef'
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom:5,
    color:'#484848',
    lineHeight:22
  },
  loading: {
    height: 60
  },
  contentText: {
    lineHeight:20,
    color:'#484848'
  },
  more: {
    borderTopWidth: 1,
    borderColor: '#efefef',
    padding:15,
    backgroundColor:'#fff'
  }
})
