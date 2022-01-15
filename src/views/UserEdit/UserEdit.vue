<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userProfile.photo"
            @click="$refs.fileRef.click()"
          />
          <!-- 文件选择框 -->
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            v-show="false"
            ref="fileRef"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="onNameCellClick"
      />
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="onBirthCellClick"
      />
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <van-dialog
      v-model="showNameDialog"
      title="修改名称"
      show-cancel-button
      :closeOnClickOverlay="true"
      :beforeClose="beforeClose"
    >
      <!-- input-align 文本横向的对其方式 -->
      <van-field
        v-model.trim="name"
        placehol
        der="请输入用户名"
        input-align="center"
        maxlength="7"
        ref="nameRef"
      />
    </van-dialog>

    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthSheet">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthSheet = false"
        @confirm="updateBirthday"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI.js'
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data() {
    return {
      // 控制是否显示 修改名字的 弹出层
      showNameDialog: false,
      name: '',
      // 是否展示修改生日的对话框
      showBirthSheet: false,
      // 最小可选日期（0 表示 1月份）
      minDate: new Date(1900, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2050, 11, 31),
      // 当前日期
      currentDate: new Date()
    }
  },
  methods: {
    ...mapActions(['initUserProfile']),
    // 点击了编辑名字的 cell
    onNameCellClick() {
      // 展示对话框
      this.showNameDialog = true
      // 把用户的名称赋值给 data 中的 name
      this.name = this.userProfile.name
      // DOM 加载完之后 自动获得焦点
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },
    // Dialog 关闭前的处理函数,默认有两个 回调函数
    beforeClose(action, done) {
      // action 可能的值有两个：cancel 和 confirm
      //  如果点击了 ‘取消’
      if (action === 'cancel') return done()
      // 调用 done() 时会关闭对话框；调用 done(false) 时会阻止对话框关闭
      // 判断名称的长度是否不合法
      if (this.name === '') {
        this.$notify({
          type: 'warning',
          message: '名称不能为空',
          duration: 2000
        })
        this.$refs.nameRef.focus()
        done(false)
      }

      this.updateName(done)
    },
    // 修改名字的函数
    async updateName(done) {
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name })
        if (res.message === 'OK') {
          // 1.关闭对话框
          done()
          // 2.重新渲染页面
          this.initUserProfile()
          // 3.提示修改成功
          this.$notify({
            type: 'success',
            message: '修改成功啦~',
            duration: 2000
          })
        }
      } catch (e) {
        if (e.response.status === 409) {
          this.$notify({
            type: 'warning',
            message: '用户名已被占用案啦~',
            duration: 2000
          })
          done(false)
          this.$refs.nameRef.focus()
        } else {
          this.$notify({
            type: 'warning',
            message: '修改名称失败TT~',
            duration: 2000
          })
          done()
        }
      }
    },
    // 点击了修改生日的 cell 展示
    onBirthCellClick() {
      this.showBirthSheet = true
      // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
      this.currentDate = this.userProfile.birthday
        ? new Date(this.userProfile.birthday)
        : new Date()
    },
    // 修改生日的函数
    async updateBirthday(value) {
      this.showBirthSheet = false
      // console.log(value)
      // 调用 dayjs 的 .format() 方法把事件格式化
      const dateStr = dayjs(value).format('YYYY-MM-DD')
      const { data: res } = await updateUserProfileAPI({ birthday: dateStr })
      if (res.message === 'OK') {
        // 重新获取信息渲染页面
        this.initUserProfile()
        // 提示用户更新成功
        this.$notify({
          type: 'success',
          message: '修改成功啦~',
          duration: 2000
        })
      }
    },
    // 选中的文件发生了变化,修改头像
    async onFileChange(e) {
      // 获取到用户选择的文件列表
      const files = e.target.files
      // 如果没有选择任何文件，则不执行后续的业务逻辑
      if (files.length === 0) return
      // 打印用户选择的第一个文件
      // console.log(files[0])

      const fd = new FormData()

      fd.append('photo', files[0])

      const { data: res } = await updateUserAvatarAPI(fd)

      if (res.message === 'OK') {
        // 重新获取信息渲染页面
        this.initUserProfile()
        // 提示用户更新成功
        this.$notify({
          type: 'success',
          message: '更新头像成功啦~',
          duration: 2000
        })
      }
    }
  },
  created() {
    this.initUserProfile()
  },
  computed: {
    ...mapState(['userProfile'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
