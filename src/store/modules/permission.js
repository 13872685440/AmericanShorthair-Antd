import { constantRouterMap } from '@/config/router.config'
import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { getRouters } from '@/api/login'

const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  A00020001_ADD : () => import('@/views/system/apptree/Form')
  // workplace: () => import('@/views/dashboard/Workplace'),
  // A00010001: () => import('@/views/system/apptree/Main'),
  // A00010002: () => import('@/views/system/role/Main'),
}

const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

export const generator = (routerMap) => {
  return routerMap.map(item => {
    var com = item.component
    if (item.key && (item.key.indexOf("/") === -1)) {
      constantRouterComponents[item.key] = () => import('@/views' + item.component)
      com = item.key
    }

    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || item.key || '',
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[com],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined }
    }

    if (item.hide) {
      currentRouter.hidden = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children)
    }
    return currentRouter
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        // ajax
        getRouters(data).then(res => {
          const result = res.result
          const routers = generator(result)
          routers.push(notFoundRouter)
          commit('SET_ROUTERS', routers)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default permission
