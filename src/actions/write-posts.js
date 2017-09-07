import Ajax from '../common/ajax'

export function setTopic({ topic, callback=()=>{} }) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_WRITE_POSTS_TOPIC', topic })
  }
}
