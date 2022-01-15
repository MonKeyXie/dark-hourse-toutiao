<template>
  <div @click="$router.push('/article/' + artId)">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <img
            v-lazy="article.cover.images[0]"
            alt=""
            class="thumb"
            v-if="article.cover.type === 1"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type > 1">
          <img
            v-for="(item, i) in article.cover.images"
            :key="i"
            v-lazy="item"
            alt=""
            class="thumb"
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span
            >作者：{{ article.aut_name }} &nbsp;&nbsp;
            {{ article.comm_count }}评论 &nbsp;&nbsp; 发布日期{{
              article.pubdate
            }}</span
          >
          <!-- 关闭按钮 -->
          <!-- 通过 .stop 事件修饰符，阻止点击事件的冒泡 -->
          <van-icon name="cross" @click.stop="show = true" v-if="closable" />
        </div>
      </template>
    </van-cell>

    <!-- 点击关闭按钮 反馈的动作面板 -->
    <!-- 动作面板中的内容上下滑动时，会导致 List 列表组件的 下拉刷新 vant中的
    get-container 属性把面板组件挂载到 body上-->
    <van-action-sheet
      v-model="show"
      cancel-text="取消"
      @closed="isFirst = true"
      get-container="body"
    >
      <!-- 第一级反馈面板 -->
      <div v-if="isFirst">
        <!-- 循环渲染可选项 -->
        <van-cell
          :title="item.name"
          clickable
          class="center-title"
          v-for="item in actions"
          :key="item.name"
          @click="onCellClick(item.name)"
        />
      </div>
      <!-- 第二级反馈面板 -->
      <div v-else>
        <van-cell
          title="返回"
          clickable
          title-class="center-title"
          @click="isFirst = true"
        />
        <van-cell
          v-for="item in reports"
          :key="item.type"
          :title="item.label"
          clickable
          title-class="center-title"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// 举报文章 的 二级面板数据
import reports from '@/api/reports'
// 按需导入 API 接口
import { dislikeArticleAPI } from '@/api/homeAPI.js'

export default {
  name: 'ArtItem',
  //  自定义属性
  props: {
    // 文章的信息对象
    article: {
      type: Object, // 数据类型
      required: true // 必填项
    },
    closable: {
      type: Boolean,
      default: true
    }
    // title: {
    //   type: String,
    //   default: ''
    // },
    // author: {
    //   type: String,
    //   default: ''
    // },
    // cmtCount: {
    //   type: [Number, String],
    //   default: 0
    // },
    // time: {
    //   type: String,
    //   default: ''
    // },
    // cover: {
    //   type: Object,
    //   // 通过 function ，返回 cover 属性的默认值
    //   default: function () {
    //     return { cover: 0 }
    //   }
    // }
  },
  data() {
    return {
      // 是否展示反馈面板
      show: false,
      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 是否展示第一个反馈面板
      isFirst: true,
      // 第二个面板的可选项列表，数组中每一项的格式 { type, label }
      reports
    }
  },
  methods: {
    // 一级选项的点击事件处理函数
    async onCellClick(name) {
      if (name === '不感兴趣') {
        // 调用 API 接口，将文章设置为不感兴趣
        const { data: res } = await dislikeArticleAPI(this.artId)
        if (res.message === 'OK') {
          // 点击 “不感兴趣” 把此项文章从当前去除
          this.$emit('remove-article', this.artId)
        }
        this.show = false
      } else if (name === '拉黑作者') {
        this.show = false
      } else if (name === '反馈垃圾内容') {
        // TODO：展示二级反馈面板
        this.isFirst = false
      }
    }
  },
  computed: {
    // 文章 Id 的计算属性
    artId() {
      // 注意：文章对象的 art_id 是大数对象，需要调用 .toString() 方法转换为字符串形式
      return this.article.art_id.toString()
    }
  }
}
</script>

<style scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  /* 矩形黄金比例：0.618 */
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  /* align-items: flex-start; */
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

.center-title {
  text-align: center;
}
</style>
