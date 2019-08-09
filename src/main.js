// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import message from 'ant-design-vue/es/message'
import notification from 'ant-design-vue/es/notification'

// mock
// import './mock'
import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
// import './utils/filter' // global filter

import globalVariable from './store/mutation-types'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.GLOBAL = globalVariable

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

