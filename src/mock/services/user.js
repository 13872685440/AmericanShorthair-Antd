import Mock from 'mockjs2'
import { builder } from '../util'

// 构造用户信息
const info = (options) => {
  console.log('options', options)
  const userInfo = {
    'id': '4291d7da9005377ec9aec4a71ea837f',
    'name': '管理员',
    'username': 'admin',
    'password': '',
    'avatar': '/logo.jpg',
    'status': 1,
    'telephone': '',
    'roles': [{
      'roleId': 'SYS_ADMINISTRATOR',
      'roleName': '超级管理员',
      'permissions': [{}]
    }]
  }

  userInfo.role = roleObj
  return builder(userInfo)
}

Mock.mock(/\/api\/system\/info\/user/, 'get', info)
