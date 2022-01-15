<template>
  <div class="home-container">
    <!-- 头部 -->
    <van-nav-bar title="今日文章" fixed />

    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      :disabled="finished"
      @refresh="onRefresh"
    >
      <!-- 上拉刷新 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        @load="onLoad"
      >
        <!-- 导入，注册，使用 ArticleInfo 组件 -->
        <!-- 使用组件的时候，如果某个属性名是“小驼峰”形式，则绑定属性时建议写成
          “连字符” 形式 => :cmt-count,子组件 props 不一样不会报错 -->
        <ArticleInfo
          v-for="item in artlist"
          :key="item.id"
          :title="item.title"
          :author="item.aut_name"
          :cmt-count="item.comm_count"
          :time="item.pubdate"
          :cover="item.cover"
        ></ArticleInfo>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入封装好的 axios 请求函数
import { getArticleListAPI } from '@/api/articleAPI.js'
import ArticleInfo from '@/components/Article/ArticleInfo.vue'

import _ from 'lodash'
let fn = null

// console.log(getArticleListAPI(1, 5))

export default {
  name: 'Home',
  data() {
    return {
      // 页码值
      page: 1,
      // 每页显示多少条数据
      limit: 10,
      // 文章的数组
      artlist: [],
      // 是否正在加载下一页数据，如果 loading 为 true ，则不会反复触发 load 事件
      // 数据请求到了，改为false
      loading: true,
      // 是否加载完毕，如果没有数据了，就变成 true
      finished: false,
      // 是否正在下拉刷新
      isLoading: false
    }
  },
  created() {
    this.initArticleList()
  },
  activated() {
    fn = this.recordTopHandler()
    window.addEventListener('scroll', fn)
  },
  deactivated() {
    window.removeEventListener('scroll', fn)
  },
  methods: {
    // 封装获取文章列表数据的方法
    async initArticleList(isRefresh) {
      const { data: res } = await getArticleListAPI(this.page, this.limit)
      // console.log(res)

      if (isRefresh) {
        // 证明是下拉刷新，新数据在前，旧数据在后
        this.artlist = [...res, ...this.artlist]
        this.isLoading = false
      } else {
        //  不能用push，push会变成 [...,[ ]]
        this.artlist = [...this.artlist, ...res]
        this.Loading = false
      }

      // 加载状态结束
      this.loading = false

      if (res.length === 0) {
        // 证明没有新数据了
        this.finished = true
      }
    },
    // 上拉请求下一页数据
    onLoad() {
      // 异步更新数据
      this.page++
      this.initArticleList()
    },
    // 是否触发下拉刷新
    onRefresh() {
      // page+1 在头部更新数据
      this.page++
      // this.isLoading = true
      this.initArticleList(true)
    },
    // 记录 滚动 条位置
    recordTopHandler() {
      return _.debounce(
        // lodash 中的防抖函数

        () => {
          this.$route.meta.top = window.scrollY
        },
        50,
        { trailing: true }
      )
    }
  },
  // 注册组件
  components: {
    ArticleInfo
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;

  /deep/ .van-nav-bar__title {
    color: #fff;
  }
}
</style>
