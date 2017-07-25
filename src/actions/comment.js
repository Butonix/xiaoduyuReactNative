import Ajax from '../common/ajax'
import { DateDiff } from '../common/date'


export function addComment({ data, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let commentState = getState().comment

    console.log(data);

    return Ajax({
      url: '/write-comment',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback: (res) => {

        if (res.success && res.data) {
          /*
          for (let i in commentState) {
            // 评论 和 回复
            if (!parent_id && i == posts_id ||
              parent_id && i == parent_id) {
              commentState[i].data.push(res.data)
            }

            commentState[i].data.map(item=>{
              if (item._id == parent_id) {
                item.reply.push(res.data)
                item.reply_count += 1
              }
            })

          }
          */

          dispatch({ type: 'SET_COMMENT', state: commentState })
        }

        callback(res)

      }
    })

  }
}

export function loadCommentList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = null//getState().user.accessToken
    let commentList = getState().comment[name] || {}

    if (typeof(commentList.more) != 'undefined' && !commentList.more ||
      commentList.loading
    ) {
      callback()
      return
    }

    if (!commentList.data) commentList.data = []

    if (!commentList.filters) {
      filters.gt_create_at = filters.gt_create_at || 0
      filters.per_page = filters.per_page || 30
      commentList.filters = filters
    } else {
      filters = commentList.filters
      if (commentList.data[commentList.data.length - 1]) {
        filters.gt_create_at = new Date(commentList.data[commentList.data.length - 1].create_at).getTime()
      }
    }

    if (!commentList.more) commentList.more = true
    if (!commentList.count) commentList.count = 0
    if (!commentList.loading) commentList.loading = true

    dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/comments',
      params: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        let _commentList = res.data

        commentList.more = res.data.length < commentList.filters.per_page ? false : true
        commentList.data = commentList.data.concat(processCommentList(_commentList))
        commentList.filters = filters
        commentList.count = 0
        commentList.loading = false

        dispatch({ type: 'SET_COMMENT_LIST_BY_NAME', name, data: commentList })
        callback(res)
      }
    })

  };
}

export const loadCommentById = ({ id, callback = () => {} }) => {
  return (dispatch, getState) => {

    return loadCommentList({
      name: id,
      filters: { comment_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (res) => {

        if (res.success && res.data && res.data.length > 0) {
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })(dispatch, getState)

  }
}

const processCommentList = (list) => {
  list.map(item=>{
    item._create_at = DateDiff(item.create_at)

    item.content_html = item.content_html.replace(/\/\/img/g, 'https://img')
    item.content_html = item.content_html.replace(/\<p\>/g, '<span>')
    item.content_html = item.content_html.replace(/\<\/p\>/g, '</span>')

    if (item.reply) {
      item.reply.map(item=>{
        item._create_at = DateDiff(item.create_at)

        item.content_html = item.content_html.replace(/\/\/img/g, 'https://img')
        item.content_html = item.content_html.replace(/\<p\>/g, '<span>')
        item.content_html = item.content_html.replace(/\<\/p\>/g, '</span>')

      })
    }
  })
  return list
}
