// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView } from '@/layouts'

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login', // 登陆
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/init', // 初始化
    component: RouteView,
    redirect: '/init',
    hidden: true,
    children: [
      {
        path: '',
        name: 'init',
        component: () => import(/* webpackChunkName: "init" */ '@/views/user/Init')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
