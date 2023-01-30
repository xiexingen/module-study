// CommonJS 的写法
module.exports = {
  mode: 'development', // 开发环境，不压缩代码
  entry: './src/main.js', // 配置入口文件，跟很多后端一样 习惯叫 main
  devtool: 'source-map', // 方便查看打包后的代码
}