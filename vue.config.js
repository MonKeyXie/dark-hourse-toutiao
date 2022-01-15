// 此配置文件， 可以对整个项目的打包，构建进行全局性的配置

const path = require('path')
// 因为下面要求绝对路径，我们自己 用 path 模块获取路径
const themePath = path.join(__dirname, './src/theme.less')

module.exports = {
  publicPath: './', //打包能看到网页，不是File
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          // 'nav-bar-background-color': '#007bff',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${themePath}";`
        }
      }
    }
  },

  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称: window 全局的成员名称
      'highlight.js': 'hljs',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      vant: 'vant',
      dayjs: 'dayjs',
      'socket.io-client': 'io',
      popmotion: 'popmotion'
    }
  }
}
