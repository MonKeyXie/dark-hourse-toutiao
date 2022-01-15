import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '@/views/Home/Home.vue'
// import User from '@/views/User/User.vue'
// import Main from '@/views/Main/Main.vue'
// import Search from '@/views/Search/Search.vue'
// import SearchResult from '@/views/SearchResult/SearchResult.vue'
// // 导入文章详情组件
// import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
// import UserEdit from '@/views/UserEdit/UserEdit.vue'
// import Chat from '@/views/Chat/Chat.vue'
import store from '@/store/index.js'
// import Login from '@/views/Login/Login.vue'

// 把vueRouter安装为 Vue 的插件
Vue.use(VueRouter)

// 路由规则的数组
const routes = [
  // 定义首页的路由规则
  // {
  //   path: '/',
  //   // redirect: '/layout/home'
  //   redirect: '/login'
  // },
  {
    path: '/',
    component: () => import('@/views/Main/Main.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/Home/Home.vue'),
        name: 'home',
        meta: { isRecord: true, top: 0 }
      },
      {
        path: '/user',
        component: () => import('@/views/User/User.vue'),
        name: 'user'
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue')
  },
  { path: '/search', component: () => import('@/views/Search/Search.vue') },
  // 查询结果
  {
    path: '/search/:kw',
    component: () => import('@/views/SearchResult/SearchResult.vue'),
    name: 'search-result',
    meta: { isRecord: true, top: 0 },
    props: true
  },
  {
    path: '/article/:id',
    component: () => import('@/views/ArticleDetail/ArticleDetail.vue'),
    name: 'art-deatil',
    props: true
  },
  {
    path: '/user/edit',
    component: () => import('@/views/UserEdit/UserEdit.vue'),
    name: 'user-edit'
  },
  // 小思聊天的路由规则
  {
    path: '/chat',
    component: () => import('@/views/Chat/Chat.vue'),
    name: 'chat'
  }
]

// 创建路由实例对象
const router = new VueRouter({
  routes,
  // 点击浏览器的前进后退或切换导航触发
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个位置
    if (savedPosition) {
      // console.log(savedPosition)
      setTimeout(() => {
        return savedPosition
      })
    } else {
      // console.log(to.meta.top)
      return { x: 0, y: to.meta.top || 0 }
    }
  }
})

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 访问的是需要权限的页面，需要判断用户是否登录
    // 1. 从 store 中获取 token 的值
    //    注意：store.state.tokenInfo 要么是 {} 空对象，要么是包含 {token, refresh_token} 的对象
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // 不为空，说明登录过
      next()
    } else {
      // next('/login')

      // now：还没有登录，强制跳转到登录页，并携带路由的 "query 查询参数"
      // 登录后 根据参数地址 跳转回原页面
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    next()
  }
})

// 全局后置钩子 跳转后执行
// router.afterEach((to) => {
//   // 如果当前的路由的元信息中，isRecord 的值为 true
//   if (to.meta.isRecord) {
//     setTimeout(() => {
//       console.log(to.meta.top)
//       // 则把元信息中的 top 值设为滚动条纵向滚动的位置
//       window.scrollTo(0, to.meta.top)
//     }, 0)
//   }
// })

// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  } else {
    // 通过 .catch 捕获错误
    return originalPush.call(this, location).catch((err) => err)
  }
}

// 输出给main.js挂载
export default router
