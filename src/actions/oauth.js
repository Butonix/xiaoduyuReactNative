import Ajax from '../common/ajax'

// 登录
export function weiboGetUserInfo({ data, callback = ()=>{} }) {
  return Ajax({
    url: '/weibo-get-user-info',
    type: 'post',
    data: data,
    callback
  })
}

export function QQGetUserInfo({ data, callback = ()=>{} }) {
  return Ajax({
    url: '/qq-get-user-info',
    type: 'post',
    data: data,
    callback
  })
}
