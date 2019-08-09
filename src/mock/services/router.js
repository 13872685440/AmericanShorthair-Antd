import Mock from 'mockjs2'
import { builder } from '../util'

// 构造路由信息
const router_info = (options) => {
  console.log('options', options)
  const routers = [
    {
      "title": "首页",
      "key": "",
      "name": "index",
      "component": "BasicLayout",
      "redirect": "/index",
      "children": [
        {
          "title": "仪表盘",
          "key": "/dashboard",
          "component": "RouteView",
          "icon": "form",
          "children": [
            {
              "title": "工作台",
              "key": "workplace",
              "path": "/index"
            }
          ]
        },
        {
          "title": "系统管理",
          "key": "/0001",
          "component": "RouteView",
          "icon": "form",
          "children": [
            {
              "title": "菜单管理",
              "key": "A00010001",
              "path": "/apptree/main"
            },
            {
              "title": "角色管理",
              "key": "A00010002",
              "path": "/role/main"
            }
          ]
        }
      ]
    }
  ]

  return builder(routers)
}

Mock.mock(/\/api\/system\/info\/router/, 'get', router_info)
