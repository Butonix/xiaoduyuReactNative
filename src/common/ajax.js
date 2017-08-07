
import config from '../../config'
import errors from '../../config/errors'
import axios from 'axios'

const converterErrorInfo = (res) => {

  if (res.error) {
    // 单个错误
    if (typeof(res.error) == 'number') {
      res.error = errors[res.error] || '未知错误: '+res.error
    } else {
      // 多个错误提示
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '未知错误: '+res.error[i]
      }
    }
  }


  // 参数替换
  if (res.error_data) {

    if (typeof(res.error) == 'number' || typeof(res.error) == 'string') {
      for (let i in res.error_data) {
        res.error = res.error.replace(new RegExp('{'+i+'}',"g"), res.error_data[i])
      }
      // react native 不支持 format
      // res.error = res.error.format(res.error_data);
    } else {
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '未知错误: '+res.error[i]

        for (let i in res.error_data) {
          res.error[i] = res.error[i].replace(new RegExp('{'+i+'}',"g"), res.error_data[i])
        }
        // react native 不支持 format
        // res.error[i] = res.error[i].format(res.error_data);
      }
    }

  }

  return res

}

const AJAX = ({ url = '', type = 'get', params = {}, data = {}, headers = {}, callback = ()=>{} }) => {

  let option = {
    url: config.api_url + '/' + config.api_verstion + url,
    method: type
  }

  if (type == 'get') {
    params._t = new Date().getTime()
    option.params = params
  } else if (type == 'post') {
    option.data = data
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  if (type == 'post' && headers.AccessToken) {
    option.data.access_token = headers.AccessToken
    delete option.headers
  }

  if (config.debug && console.log) console.log('请求: ', option)

  return axios(option).then(resp => {
    if (config.debug && console.log) console.log('返回: ', resp)

    if (resp && resp.data) {
      let res = resp.data
      res = converterErrorInfo(res)
      callback(res)
    } else {
      callback(null)
    }

  })
  .catch(function (error, res) {
    if (config.debug) console.log('返回: ', error.response.data)
    if (error && error.response && error.response.data) {
      let res = error.response.data
      res = converterErrorInfo(res)
      callback(res)
    } else {
      callback(null)
    }

  });
}

export default AJAX
