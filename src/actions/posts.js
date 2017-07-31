
import Ajax from '../common/ajax'
import { DateDiff } from '../common/date'

const abstractImages = (str) => {

  let images = []

  var imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  var result = [];
  var img ;
  while(img = imgReg.exec(str)){
    result.push(img[0]);//这里的下标是匹配结果，跟你说的下标不是一回事
  }

  if (result && result.length > 0) {
    result.map((item, index) => {
      images[index] = item.match(srcReg)[1];
    })
  }

  return images

}

// 加工问题列表
const processPostsList = (list) => {

  list.map(function(posts){

    posts.images = abstractImages(posts.content_html)

    let text = posts.content_html.replace(/<[^>]+>/g,"")
    if (text.length > 140) text = text.slice(0, 140)+'...'
    posts.content_summary = text

    posts._create_at = DateDiff(posts.create_at)

    // 在ios，html渲染需要转换格式
    posts.content_html = posts.content_html.replace(/\/\/img/g, 'https://img')
    posts.content_html = posts.content_html.replace(/\<p\>/g, '<span>')
    posts.content_html = posts.content_html.replace(/\<\/p\>/g, '</span>')

    if (posts.comment) {
      posts.comment.map(function(comment){

        comment.images = abstractImages(comment.content_html)

        comment._create_at = DateDiff(comment.create_at)

        let text = comment.content_html.replace(/<[^>]+>/g,"")
        if (text.length > 140) text = text.slice(0, 140)+'...'
        comment.content_summary = text

      })
    }

  })

  return list

}

export function loadPostsList({ name, filters = {}, callback=()=>{}, restart = false, url }) {
  return (dispatch, getState) => {

    let postsList = getState().posts[name] || {}
    let accessToken = getState().user.accessToken

    if (restart) postsList = {}
    if (typeof(postsList.more) != 'undefined' && !postsList.more || postsList.loading) {
      callback()
      return
    }

    if (!postsList.data) postsList.data = []

    if (!postsList.filters) {
      if (!filters.per_page) filters.per_page = 30
      postsList.filters = filters
    } else {
      filters = postsList.filters
      if (postsList.data[postsList.data.length - 1]) {
        filters.lt_date = new Date(postsList.data[postsList.data.length - 1].sort_by_date).getTime()
      }
    }

    if (!postsList.more) postsList.more = true
    if (!postsList.count) postsList.count = 0
    if (!postsList.loading) postsList.loading = true

    dispatch({ type: 'ADD_POSTS_LIST', name, list: postsList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    return Ajax({
      url: '/posts',
      params: filters,
      headers,
      callback: (res) => {

        console.log(res);

        if (!res || !res.success) {
          callback(res)
          return
        }

        postsList.more = res.data.length < postsList.filters.per_page ? false : true
        postsList.data = postsList.data.concat(processPostsList(res.data))
        postsList.filters = filters
        postsList.count = 0
        postsList.loading = false

        // setTimeout(()=>{
          dispatch({ type:'ADD_POSTS_LIST', name, list: postsList })
          callback(res)
        // }, 1000)

      }
    })

  }
}

export function loadPostsById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return loadPostsList({
      name: id,
      filters: { posts_id: id, per_page: 1, draft: 1 },
      restart: true,
      callback: (result)=>{
        if (!result || !result.success || !result.data || result.data.length == 0) {
          return callback(result)
        }
        callback(result.data[0])
      }
    })(dispatch, getState)
  }
}

export function cleanAllPosts() {
  return (dispatch, getState) => {
    dispatch({ type: 'CLEAN_ALL_POSTS' })
  }
}
