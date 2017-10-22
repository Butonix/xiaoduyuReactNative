
import merge from 'lodash/merge'

let initialState = {
  profile: {},
  unreadNotice: [],
  accessToken: ''
}

export default function user(state = initialState, action = {}) {

  switch (action.type) {

    case 'ADD_ACCESS_TOKEN':
      state.accessToken = action.accessToken
      return merge({}, state, {})

    case 'REMOVE_ACCESS_TOKEN':
      state.accessToken = ''
      state.unreadNotice = []
      state.profile = {}
      return merge({}, state, {})

    case 'SET_USER':
      state.profile = action.userinfo
      return merge({}, state, {})
      
    case 'SET_UNREAD_NOTICE':
      state.unreadNotice = action.unreadNotice
      return merge({}, state, {})

    case 'CLEAN_USEINFO':
      return merge({}, {
        profile: {},
        unreadNotice: [],
        accessToken: ''
      }, {})

    default:
      return state
  }

}

export function getUserInfo(state) {
  return state.user.profile._id ? state.user.profile : null
}

export function getProfile(state) {
  return state.user.profile || {}
}

export function getUnreadNotice(state) {
  return state.user.unreadNotice || []
}

export const getAccessToken = (state) => state.user.accessToken
