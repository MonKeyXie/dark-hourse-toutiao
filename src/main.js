import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入并安装 Vant 组件库
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
import store from './store'

//  pxtorem相关
import 'amfe-flexible'
// 删除 <img> 标签的 src 属性，并应用 v-lazy 指令，指令的值是要展示的图片地址
Vue.use(Lazyload)
Vue.use(Vant, {
  lazyComponent: true
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
