
import merge from 'lodash/merge'

let initialState = {
  topic: null,
  title: '',
  cotnent: ''
}

export default function writePosts(state = initialState, action = {}) {
  switch (action.type) {

    case 'SET_WRITE_POSTS_TOPIC':
      state.topic = action.topic
      console.log(state);
      return merge({}, state, {})

    default:
      return state;
  }
}

export const getWritePosts = (state) => {
  return state.writePosts
}
