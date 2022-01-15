import Vue from 'vue'
import Vuex from 'vuex'
// 导入请求用户信息的 API 方法
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'

Vue.use(Vuex)

// 初始的 state 对象
let initState = {
  // token 的信息对象
  tokenInfo: {
    token: '',
    refresh_token: ''
  },
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}
// 在 new Vuex.Store() 之前，读取 localStorage 中本地存储的 state 字符串：
const stateStr = localStorage.getItem('state')
if (stateStr) {
  // 加载本地数据
  initState = JSON.parse(stateStr)
  // console.log('本地数据', initState.tokenInfo)
}

export default new Vuex.Store({
  state: {
    // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
    // 为 state 赋初值
    tokenInfo: initState.tokenInfo,
    userInfo: initState.userInfo,
    userProfile: initState.userProfile
  },
  mutations: {
    // 更新 tokenInfo 数据的方法,
    // 第一个参数为 store 中的 state，第二个参数开始才是提交过来的参数
    updateTokenInfo(state, paylod) {
      // 把提交过来的 payload 对象，作为 tokenInfo 的值
      state.tokenInfo = paylod
      // console.log(state.tokenInfo)

      // 如果希望在 Mutation A 中调用 Mutation B，需要通过 this.commit() 方法来实现
      // this 表示当前的 new 出来的 store 实例对象
      this.commit('saveStateToStorage')
    },

    // 更新 userInfo 的方法
    updateUserInfo(state, payload) {
      // 1. 把用户信息转存到 state 中
      state.userInfo = payload
      // 2. 将最新的 state 对象持久化存储到本地
      this.commit('saveStateToStorage')
    },

    // 更新 userProfile 的方法
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    },

    // 清空 vuex 和本地的数据
    cleanState(state) {
      state.tokenInfo = {}
      state.userInfo = {}
      this.commit('saveStateToStorage')
    },

    // 将 state 持久化存储到localStorage ,（因为浏览器刷新vuex会清空）
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  // actions 执行异步操作，其终点就是提交mutation，不直接操作 state
  actions: {
    // 初始化用户的基本信息
    // 默认第一个参数，其值是复制的一份store
    async initUserInfo(ctx) {
      // 调用 API 接口
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // 把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        ctx.commit('updateUserInfo', res.data)
      }
    },
    // 初始化用户的简介信息
    async initUserProfile(ctx) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },

  getters: {
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

      // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }

      return imgSrc
    }
  }
})
