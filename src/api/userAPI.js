// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面,导入这个接口方法,就能发请求
// 好处: 请求url路径,可以在这里统一管理

// 导入基于axios封装的网络请求
import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage.js'
// 导入本地存储的token
// import { getToken } from '@/utils/token.js'

// export const loginAPI = (data) => {
//   return request.post('/v1_0/authorizations', data)
// }
// 登录 - 登录接口
// 写法2
export const loginAPI = ({ mobile, code }) =>
  request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })

// 请求用户基本信息的 API
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

// 请求用户简介信息的 API
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

// 修改用户简介信息的 API（形参中的 obj 是对象格式的简介信息）
// 可能的格式有以下两种：
// { name: 'xxx' } 或 { birthday: '2012-12-12' }
export const updateUserProfileAPI = (obj) => {
  return request.patch('/v1_0/user/profile', obj)
}

// 修改头像的 API（形参中的 fd 表示 FormData 格式的表单数据）
export const updateUserAvatarAPI = (fd) => {
  return request.patch('/v1_0/user/photo', fd)
}

// 用户 - 刷新token
export const getNewTokenAPI = () =>
  request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + getStorage('refresh_token')
    }
  })
