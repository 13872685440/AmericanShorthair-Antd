import Vue from 'vue'
import router from './router'
import store from './store'
import { init } from '@/api/login'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import notification from 'ant-design-vue/es/notification'
// import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { timeFix } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'init', '403'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // 当访问/init的时候，如果系统中没有用户，则跳转到初始化的页面
  if (to.name === 'init') {
    init().then(response => {
      if (response == '-1') {
        next()
      } else {
        next({ path: '/login' })
      }
    })
    NProgress.done()
  } else {
    if (Vue.ls.get(ACCESS_TOKEN)) {
      if (to.path === '/login') {
        next({ path: '/index' })
        NProgress.done()
      } else {
        if (store.getters.roles.length === 0) {
          store
            .dispatch('GetInfo')
            .then(res => {
              const userRoles = res.result && res.result.roleList

              store.dispatch('GenerateRoutes', { userRoles }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)

                const redirect = decodeURIComponent(from.query.redirect || to.path)

                if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }

                setTimeout(() => {
                  notification.success({
                    message: "欢迎",
                    description: `${timeFix()}，欢迎回来`
                  });
                }, 500);
              })
            })
            .catch(() => {
              notification.error({
                message: '错误',
                description: '请求用户信息失败，请重试'
              })
              store.dispatch('Logout').then(() => {
                next({ path: '/login', query: { redirect: to.fullPath } })
              })
            })
        } else {
          next()
        }
      }
    } else {
      if (whiteList.includes(to.name)) {
        // 在免登录白名单，直接进入
        next()
      } else {
        if (to.name) {
          notification.error({
            message: '登录超时',
            description: '登录超时，请重新登录'
          })
        }
        next({ path: '/login' })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

const action = Vue.directive('action', {
  bind: function (el, binding) {
    const actionName = binding.arg
    const actions = actionName.split(",")
    const roles = store.getters.roles
    var hide = true
    roles.forEach(p => {
      if (actions && actions.includes(p)) {
        hide = false;
        return;
      }
    })
    if (hide) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

const noaction = Vue.directive('noaction', {
  bind: function (el, binding) {
    const actionName = binding.arg
    const actions = actionName.split(",")
    const roles = store.getters.roles
    var hide = false
    roles.forEach(p => {
      if (actions && actions.includes(p)) {
        hide = true;
        return;
      }
    })
    if (hide) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export {
  action, noaction
}