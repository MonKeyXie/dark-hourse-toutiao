import axios from 'axios'
// 从 vant 中按需引入 Toast 组件(提示)
import { Toast } from 'vant'
// 基于拦截器实现token 认证
import store from '@/store/index'
import router from '@/router'

const instance = axios.create({
  // 指定 axios 请求的根路径
  // baseURL: 'http://www.escook.cn'
  baseURL: 'http://geek.itheima.net'
})

// axios请求拦截器
// 注意：在我们的项目中，是基于 instance 实例来发起 ajax 请求的，因此一定要为 instance 实例绑定请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做什么
    // 展示Loading效果
    Toast.loading({
      message: '加载中哦~~',
      forbidClick: true,
      duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    // 从 vuex 中获取 token 值
    const tokenStr = store.state.tokenInfo.token
    // 若tokenStr 的值不为空， 则为这次请求的请求头添加 Authorization 身份认证字段
    if (tokenStr) {
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// axios响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  (error) => {
    // Toast.fail('加载失败')
    // 401 表示Token过期
    if (error.response && error.response.status === 401) {
      // console.log('Token过期咯')
      // 清除localStorage和state的值
      store.commit('cleanState')
      // 强制跳转到登录页并记录当前访问未遂 的地址
      router.replace('/login?pre' + router.currentRoute.fullPath)
    }

    return Promise.reject(error)
  }
)

export default instance
