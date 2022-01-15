<template>
  <div class="login-container">
    <van-nav-bar title="黑马头条 - 登录" fixed />
    <!-- 登录的表单 -->
    <!--
        1.输入框name属性='用户名'
        表单整体提交时，默认收集的提交对象
        向后台发送的参数名就是name里的值
        {"用户名":'页面值'}
        2.label属性输入框左侧文本
        :属性名="表达式"
            属性名="字符串"
        -->
    <van-form @submit="login">
      <van-field
        v-model="form.mobile"
        name="mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号码"
        required
        :rules="rules.mobile"
        maxlength="11"
      ></van-field>
      <van-field
        v-model="form.code"
        type="password"
        name="code"
        label="登录密码"
        placeholder="请输入登录密码"
        required
        :rules="rules.code"
        maxlength="6"
      ></van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/userAPI'
// import { setToken } from '@/utils/token'
// import { setStorage } from '@/utils/storage.js'
// 1. 按需导入辅助方法
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
      form: {
        // 用户的手机号
        mobile: '13888888123',
        // 登录的密码
        code: '246810'
      },

      // 表单的校验规则对象
      rules: {
        // 手机号的校验规则
        // 只有同时满足以下两个验证规则，才能验证通过
        mobile: [
          { required: true, message: '请填写您的手机号', trigger: 'onBlur' },
          // 11 位手机号的校验规则
          {
            pattern: /^1\d{10}$/,
            message: '请填写正确的手机号',
            trigger: 'onBlur'
          }
        ],
        // 密码的校验规则
        code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    //  2. 映射 mutations 中的方法
    ...mapMutations(['updateTokenInfo']),

    // 只有当表单数据校验通过之后，才会调用此 login 函数
    async login(values) {
      const { data: res } = await loginAPI(values) // this.form
      // console.log(res)

      if (res.message === 'OK') {
        // 3. 把登录成功的结果，存储到 vuex 的 state 中
        this.updateTokenInfo(res.data)
        // 4. 登录成功后，跳转到主页 或 原页面
        const navPath = this.$route.query.pre || '/'
        this.$router.replace(navPath)
        // setToken(res.data.token)
        // // 账号登录时就能在接口返回的数据中获取到token
        // console.log(res.data.refresh_token)
        // // 本地存储一个刷新token
        // setStorage('refresh_token', res.data.refresh_token)
        // // 跳转一定要写在最后 -> 尽量最后执行
        // //  this.$router.push()压栈 (会产生历史记录,可以回退)  this.$router.replace 替换(不会产生历史记录)
        // this.$router.replace({
        //   path: this.$route.query.path || '/layout/home'
        // })
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  padding-top: 46px;
}
</style>
