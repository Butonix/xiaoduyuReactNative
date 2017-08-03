
import { combineReducers } from 'redux'

import merge from 'lodash/merge'

import posts from './posts'
import topic from './topic'
import comment from './comment'
import user from './user'
import writePosts from './write-posts'
import notification from './notification'
import people from './people'
import followPeople from './follow-people'

let states = {
  posts,
  topic,
  comment,
  user,
  writePosts,
  notification,
  people,
  followPeople
}

let _states = {}

for (let i in states) {
  _states[i] = states[i]()
}

_states = merge({}, _states, {})

export const getInitialState = () => {
  return merge({}, _states, {})
}

export default merge({}, states, {})
