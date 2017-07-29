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
    backgroundColor:'rgb(22, 177, 244)',
    height:50,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
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
  }
})

export default styles
