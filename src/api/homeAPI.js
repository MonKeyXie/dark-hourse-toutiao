import request from '@/utils/request'

// 获取用户频道的接口
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}
// 根据频道 Id 获取文章列表, 用于在接口下展示
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id,
      timestamp: time
    }
  })
}

// 将文章设置为不感兴趣（形参 id 是文章的 id）
export const dislikeArticleAPI = (id) => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}

// 获取所有频道数据的 API
export const getAllChannelAPI = () => {
  return request.get('/v1_0/channels')
}

// 更新用户频道列表数据的 API
// 注意：形参 channels 是一个数组，格式： [ {id, seq} ]
export const updateUserChannelAPI = (channels) => {
  return request.put('/v1_0/user/channels', {
    channels
  })
}
