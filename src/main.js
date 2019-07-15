// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*
入口js
 */
import Vue from 'vue'
import {Button} from 'mint-ui'
import VueLazyload from 'vue-lazyload'
import App from './App'
import router from './router'
import store from './store'

import './mock/mockServer'// 加载mockserver即可
import loading from './common/imgs/loading.gif'
import './filters' // 加载filters过滤器
Vue.config.productionTip = false

Vue.use(VueLazyload, { // 内部会定义一个全局的指令: lazy
  loading
})

Vue.component(Button.name, Button)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router, // 使用vue-router
  store // 使用vuex
  // components: { App },
  // template: '<App/>'
})
