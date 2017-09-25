
import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import Navigators from './navigators/index'
import getStore from './store/configure-store.js'
import initGlobalParam from './global'

let store = getStore()
initGlobalParam(store)

class APP extends PureComponent {
  render() {
    return (<Provider store={store}><Navigators /></Provider>)
  }
}

export default APP
