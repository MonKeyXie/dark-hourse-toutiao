<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      :disabled="finished"
      @refresh="onRefresh"
    >
      <!-- 上拉刷新 -->
      <!-- :immediate-check="false" 属性，即可防止首次加载时触发 load 事件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="我是有底线的"
        @load="onLoad"
      >
        <!-- 循环渲染文章的列表 -->
        <art-item
          v-for="item in artlist"
          :article="item"
          :key="item.art_id"
          @remove-article="removeArticle"
        ></art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 获取频道下的文章列表
import { getArtListAPI } from '@/api/homeAPI'
// 引入文章
import ArtItem from '@/components/ArtItem/ArtItem.vue'

export default {
  name: 'ArtList',
  components: {
    ArtItem
  },
  props: {
    // 频道 Id（小驼峰命名法：第一个单词全部小写，后面的单词首字母大写）
    channelId: {
      type: Number, // 数值类型
      required: true // 必填项
    }
  },
  data() {
    return {
      // 文章列表的数组
      artlist: [],
      // 时间戳。初始的默认值为当前的时间戳
      timestamp: Date.now(),
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
    this.initArtList()
  },
  methods: {
    async initArtList(isRefresh) {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      // console.log(res)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp

        if (isRefresh) {
          // 证明是下拉刷新，新数据在前，旧数据在后
          this.artlist = [...res.data.results, ...this.artlist]
          this.isLoading = false
        } else {
          //  上拉加载  应该是“旧数据”在前，“新数据”在后
          //  不能用push，push会变成 [...,[ ]]
          this.artlist = [...this.artlist, ...res.data.results]
          this.loading = false
        }

        // 3. 判断所有的数据是否已加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    // 上拉请求下一页数据
    onLoad() {
      // console.log('触发了上拉加载更多')
      this.initArtList()
    },
    // 是否触发下拉刷新
    onRefresh() {
      // console.log('触发了下拉刷新')
      // 穿个参数判断当前是下拉刷新，否则则是上拉加载
      this.initArtList(true)
    },
    removeArticle(id) {
      // 对元素组进行过滤
      this.artlist = this.artlist.filter(
        (item) => item.art_id.toString() !== id
      )
    }
  }
}
</script>

<style lang="less" scoped></style>
