// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import message from 'ant-design-vue/es/message'
import notification from 'ant-design-vue/es/notification'
import 'element-ui/lib/theme-chalk/index.css'

// mock
// import './mock'
import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
// import './utils/filter' // global filter

import globalVariable from './store/mutation-types'

Vue.use(ElementUI, { size: 'small' })

import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'

Vue.use(FormMaking)

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

