
import merge from 'lodash/merge'

const initialState = {}

export default function posts(state = initialState, action = {}) {
  switch (action.type) {
    case 'ADD_POSTS_LIST':
      state[action.name] = action.list
      return merge({}, state, {})
    case 'CLEAN_ALL_POSTS':
      return merge({}, {}, {})
    default:
      return state;
  }
}

export const getPostListByName = (state, name)=>{
  return state.posts[name] || {}
}

export const getPostsById = (state, id) => {

  let posts = state.posts

  for (let i in posts) {
    if (i == id) {
      return [posts[i].data[0]]
    }
  }

  for (let i in posts) {
    let list = posts[i].data
    for (let n = 0, max = list.length; n < max; n++) {
      if (list[n]._id == id) {
        return [list[n]]
      }
    }
  }

  return []

}
