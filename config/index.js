
// 开发环境配置
var development = {
  debug: true,
  // 网站名称
  name: '小度鱼',
  // 网站描述
  description: '一个网络社区',
  // 验证登录状态的cookie 名称
  auth_cookie_name: 'xiaoduyu',
  // ip
  host: 'localhost',
  // 端口
  port: 4000,
  // 网站地址
  url: 'http://localhost:4000',
  // API 地址
  // api_url: 'https://www.xiaoduyu.com',
  api_url: 'http://localhost:3000',
  // api 版本路径  http://192.168.0.105:3000/api/v1
  api_verstion: 'api/v1',
  // 打包文件内用到的URL路径, 比如背景图等(可以设成http的地址, 比如: http://cdn.my.com)
  public_path: 'http://localhost:4000',
  // css modules class 名称
  class_scoped_name: '[name]_[local]__[hash:base64:5]',
  // google 分析
  GA: '',
}


module.exports = development
